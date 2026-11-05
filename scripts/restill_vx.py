import json,math,os,pathlib,subprocess,sys
os.chdir(pathlib.Path(__file__).resolve().parent.parent)  # run from repo root wherever invoked
vid,keys,frac=sys.argv[1],sys.argv[2].split(","),float(sys.argv[3])
D=json.load(open(f"public/vx/{vid}/data.json")); at=0
for b in D["beats"]:
    n=math.ceil((b["sec"]+(1.1 if b["scene"]["type"]=="title" else 0.5))*30)
    if b["key"] in keys: subprocess.run(["npx","remotion","still",os.environ.get("LTB_BUNDLE","/tmp/ltb"),f"VX-{vid}-long",f"out/vx/qa/{vid}/{b['key']}.png",f"--frame={at+int(n*frac)}","--scale=0.5","--log=error"],check=True)
    at+=n
