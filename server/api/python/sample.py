

#1
# Sets a default curve (secp256k1)
import random, requests, sys
from umbral import pre, keys, config, signing

config.set_default_curve()

#2
# Generate an Umbral key pair
# ---------------------------
# First, Let's generate two asymmetric key pairs for Alice:
# A delegating key pair and a Signing key pair.


alices_private_key = keys.UmbralPrivateKey.gen_key()
alices_public_key = alices_private_key.get_pubkey()

alices_signing_key = keys.UmbralPrivateKey.gen_key()
alices_verifying_key = alices_signing_key.get_pubkey()
alices_signer = signing.Signer(private_key=alices_signing_key)

#3
# Encrypt some data for Alice
# ---------------------------
# Now let's encrypt data with Alice's public key.
# Invocation of `pre.encrypt` returns both the `ciphertext`,
# and a `capsule`. Anyone with Alice's public key can perform
# this operation.
for line in sys.stdin.readlines():
    print(line)

rf = open("/home/anmolmiddha/Projects/coreshare/server/uploads/gdrive/83aab2d66ae46bb282e6098dc453d91f", "rb")
plaintext = rf.read()
ciphertext, capsule = pre.encrypt(alices_public_key, plaintext)
# f.write(ciphertext, "w")
print(plaintext)
print("ciphertext:\n")
print(ciphertext)

wf = open("/home/anmolmiddha/Projects/coreshare/server/uploads/gdrive/83aab2d66ae46bb282e6098dc453d91f", "wb")
wf.write(ciphertext)



#4
# Decrypt data for Alice
# ----------------------
# Since data was encrypted with Alice's public key,
# Alice can open the capsule and decrypt the ciphertext with her private key.

cleartext = pre.decrypt(ciphertext=ciphertext,
                        capsule=capsule,
                        decrypting_key=alices_private_key)
print("cleartext:\n")
print(cleartext)

#5
# Bob Exists
# -----------

bobs_private_key = keys.UmbralPrivateKey.gen_key()
bobs_public_key = bobs_private_key.get_pubkey()

#6
# Bob receives a capsule through a side channel (s3, ipfs, Google cloud, etc)
bob_capsule = capsule

#7
# Attempt Bob's decryption (fail)
try:
    fail_decrypted_data = pre.decrypt(ciphertext=ciphertext,
                                      capsule=bob_capsule,
                                      decrypting_key=bobs_private_key)
except:
    print("Decryption failed! Bob doesn't has access granted yet.")

#8
# Alice grants access to Bob by generating kfrags 
# -----------------------------------------------
# When Alice wants to grant Bob access to open her encrypted messages, 
# she creates *threshold split re-encryption keys*, or *"kfrags"*, 
# which are next sent to N proxies or *Ursulas*. 
# She uses her private key, and Bob's public key, and she sets a minimum 
# threshold of 10, for 20 total shares

kfrags = pre.generate_kfrags(delegating_privkey=alices_private_key,
                             signer=alices_signer,
                             receiving_pubkey=bobs_public_key,
                             threshold=10,
                             N=20)

#9
# Ursulas perform re-encryption
# ------------------------------
# Bob asks several Ursulas to re-encrypt the capsule so he can open it. 
# Each Ursula performs re-encryption on the capsule using the `kfrag` 
# provided by Alice, obtaining this way a "capsule fragment", or `cfrag`.
# Let's mock a network or transport layer by sampling `threshold` random `kfrags`,
# one for each required Ursula.

import random

kfrags = random.sample(kfrags,  # All kfrags from above
                       10)      # M - Threshold

# Bob collects the resulting `cfrags` from several Ursulas. 
# Bob must gather at least `threshold` `cfrags` in order to activate the capsule.

bob_capsule.set_correctness_keys(delegating=alices_public_key,
                                 receiving=bobs_public_key,
                                 verifying=alices_verifying_key)

cfrags = list()  # Bob's cfrag collection
for kfrag in kfrags:
    cfrag = pre.reencrypt(kfrag=kfrag, capsule=bob_capsule)
    cfrags.append(cfrag)  # Bob collects a cfrag

assert len(cfrags) == 10

#10
# Bob attaches cfrags to the capsule
# ----------------------------------
# Bob attaches at least `threshold` `cfrags` to the capsule;
# then it can become *activated*.

for cfrag in cfrags:
    bob_capsule.attach_cfrag(cfrag)

#11
# Bob activates and opens the capsule
# ------------------------------------
# Finally, Bob activates and opens the capsule,
# then decrypts the re-encrypted ciphertext.

bob_cleartext = pre.decrypt(ciphertext=ciphertext, capsule=bob_capsule, decrypting_key=bobs_private_key)

assert bob_cleartext == plaintext
print(bob_cleartext)