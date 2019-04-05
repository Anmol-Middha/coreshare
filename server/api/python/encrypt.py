import random, requests, sys, os, json
from umbral import pre, keys, config, signing
from umbral.curvebn import CurveBN

config.set_default_curve()

for data in sys.stdin:
    path = os.getcwd() + "/" + str(data).split(',.,')[0]

key = keys.UmbralPublicKey.from_bytes(((str(data).split(',.,')[1]).rstrip('\n').encode('cp855'))) 

rf = open(path.rstrip('\n'), "rb")
plaintext = rf.read()
# print(plaintext)
# print(type(plaintext))

ciphertext, capsule = pre.encrypt(key, plaintext)
capsule_bytes = capsule.to_bytes().decode('cp855')
json_capsule = json.dumps(capsule_bytes)
# print(ciphertext)
# print(type(ciphertext))
# print(ciphertext.decode('cp855'))
print(json_capsule)

wf = open(path.rstrip('\n'), "w")
wf.write(ciphertext.decode('cp855'))
wf.close()