import random, requests, sys, os, json
from umbral import pre, keys, config, signing, curvebn
from umbral.params import UmbralParameters
from umbral.config import default_curve

for data in sys.stdin:
    key = data

keys_dict = json.loads(key)

keys_dict['publickey'] = keys.UmbralPublicKey.from_bytes(keys_dict['publickey'].encode('cp855'))
keys_dict['privatekey'] = keys.UmbralPrivateKey.from_bytes(keys_dict['privatekey'].encode('cp855'))
keys_dict['signingkey'] = keys.UmbralPrivateKey.from_bytes(keys_dict['signingkey'].encode('cp855'))
keys_dict['senderpublickey'] = keys.UmbralPublicKey.from_bytes(keys_dict['senderpublickey'].encode('cp855'))
keys_dict['verificationkey'] = keys.UmbralPublicKey.from_bytes(keys_dict['verificationkey'].encode('cp855'))
keys_dict['receiverprivatekey'] = keys.UmbralPrivateKey.from_bytes(keys_dict['receiverprivatekey'].encode('cp855'))

newcurve = default_curve()
params = UmbralParameters(curve=newcurve)

capsule = pre.Capsule.from_bytes(keys_dict['capsule'].encode('cp855'), params)

sender_signer = signing.Signer(private_key=keys_dict['signingkey'])
kfrags = pre.generate_kfrags(delegating_privkey=keys_dict['privatekey'],
                             signer=sender_signer,
                             receiving_pubkey=keys_dict['publickey'],
                             threshold=10,
                             N=20)

capsule.set_correctness_keys(delegating=keys_dict['senderpublickey'],
                             receiving=keys_dict['publickey'],
                             verifying=keys_dict['verificationkey'])

cfrags = list()           # Bob's cfrag collection
for kfrag in kfrags[:10]:
  cfrag = pre.reencrypt(kfrag=kfrag, capsule=capsule)
  cfrags.append(cfrag)    # Bob collects a cfrag

for cfrag in cfrags:
  capsule.attach_cfrag(cfrag)

print(capsule)
print(keys_dict['ciphertext'])
print(type(keys_dict['ciphertext']))
cipher_byte = keys_dict['ciphertext'].encode('cp855')
print(cipher_byte)
bob_cleartext = pre.decrypt(ciphertext=cipher_byte, capsule=capsule, decrypting_key=keys_dict['receiverprivatekey'])

print(bob_cleartext)
print(type(bob_cleartext))

wf = open("/home/anmolmiddha/Projects/coreshare/server/tempshare/gdrive/input.txt", "wb")
wf.write(bob_cleartext)
wf.close()