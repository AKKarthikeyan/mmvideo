import json,subprocess,sys
slug,keys,frac=sys.argv[1],sys.argv[2].split(","),float(sys.argv[3])
D=json.load(open(f"public/letters/{slug}/data.json")); at=0; comp="LT-"+slug.replace("_","-")
for b in D["beats"]:
    if b["key"] in keys:
        subprocess.run(["npx","remotion","still","/tmp/ltb",comp,f"out/letters/{slug}/qa/{b['key']}.png",f"--frame={at+int(b['frames']*frac)}","--scale=0.25","--log=error"],check=True)
    at+=b["frames"]
