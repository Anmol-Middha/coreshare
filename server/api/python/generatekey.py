import random, requests, sys, os, json
from umbral import pre, keys, config, signing

config.set_default_curve()

private_key = keys.UmbralPrivateKey.gen_key()
public_key = private_key.get_pubkey()
signing_key = keys.UmbralPrivateKey.gen_key()
verification_key = signing_key.get_pubkey()

user_key = {
    'bprivatekey': private_key.to_bytes().decode('cp855'),
    'bpublickey': public_key.to_bytes().decode('cp855'),
    'bsigningkey': signing_key.to_bytes().decode('cp855'),
    'bverificationkey': verification_key.to_bytes().decode('cp855')
}

json_key = json.dumps(user_key)
print(json_key)
