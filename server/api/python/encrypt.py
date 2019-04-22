import random, requests, sys, os, json
from umbral import pre, keys, config, signing
from umbral.curvebn import CurveBN

config.set_default_curve()

for data in sys.stdin:
    path = os.getcwd() + "/" + str(data).split(',.,')[0]

key = keys.UmbralPublicKey.from_bytes(((str(data).split(',.,')[1]).rstrip('\n').encode('cp855'))) 

rf = open(path.rstrip('\n'), "rb")
plaintext = rf.read()
print(plaintext)

ciphertext, capsule = pre.encrypt(key, plaintext)
print(ciphertext)
print(vars(capsule))

capsule_bytes = capsule.to_bytes().decode('cp855')
json_capsule = json.dumps(capsule_bytes)
print(ciphertext)
print(type(ciphertext.decode('cp855')))
cipher_byte = ciphertext.decode('cp855')
cipher_decode = cipher_byte.encode('cp855')
print(cipher_byte)
if(ciphertext == cipher_decode):
    print("YES TRUE")
print(json_capsule)

wf = open(path.rstrip('\n'), "w")
wf.write(cipher_byte)
wf.close()