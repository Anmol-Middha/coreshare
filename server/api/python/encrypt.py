

import sys, random, requests
from umbral import pre, keys, config, signing

config.set_default_curve()

alices_private_key = keys.UmbralPrivateKey.gen_key()
alices_public_key = alices_private_key.get_pubkey()

alices_signing_key = keys.UmbralPrivateKey.gen_key()
alices_verifying_key = alices_signing_key.get_pubkey()
alices_signer = signing.Signer(private_key=alices_signing_key)

plaintext = b'Proxy Re-encryption is cool!'
ciphertext, capsule = pre.encrypt(alices_public_key, plaintext)

print(ciphertext)
print("Output from Python") 
