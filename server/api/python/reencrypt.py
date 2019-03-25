import random, requests, sys, os, pickle
from umbral import pre, keys, config, signing

config.set_default_curve()


kfrags = pre.generate_kfrags(delegating_privkey=alices_private_key,
                             signer=alices_signer,
                             receiving_pubkey=bobs_public_key,
                             threshold=10,
                             N=20)