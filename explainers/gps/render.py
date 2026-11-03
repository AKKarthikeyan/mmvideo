import sys,json,subprocess,asyncio,os
from playwright.sync_api import sync_playwright
D=os.path.dirname(os.path.abspath(__file__))
def page(p):
    b=p.chromium.launch(executable_path='/opt/pw-browsers/chromium',args=['--no-sandbox','--allow-file-access-from-files']);pg=b.new_page(viewport={'width':1920,'height':1080})
    pg.on('console',lambda m:print('console:',m.text));pg.on('pageerror',lambda e:print('ERR',e))
    pg.goto('file://'+D+'/index.html');pg.wait_for_function('window.READY===true',timeout=30000);return b,pg
if __name__=='__main__':
    mode=sys.argv[1]
    with sync_playwright() as p:
        b,pg=page(p);END=pg.evaluate('END')
        if mode=='sheet':
            from PIL import Image
            a,bb,n=float(sys.argv[2]),float(sys.argv[3]),16;out=sys.argv[4]
            sh=Image.new('RGB',(4*480,4*270))
            for i in range(n):
                t=a+(bb-a)*i/(n-1);pg.evaluate(f'seek({t})');pg.screenshot(path='/tmp/f.png');im=Image.open('/tmp/f.png').resize((480,270));sh.paste(im,((i%4)*480,(i//4)*270))
            sh.save(out)
        elif mode=='ev':
            json.dump(pg.evaluate('EV'),open(D+'/build/ev.json','w'));print(END,len(pg.evaluate('EV')))
        elif mode=='frames':
            fps=60;N=int(END*fps);os.makedirs(D+'/build/fr',exist_ok=True)
            ff=subprocess.Popen(['ffmpeg','-y','-loglevel','error','-f','image2pipe','-framerate','60','-c:v','mjpeg','-i','-','-c:v','libx264','-crf','16','-pix_fmt','yuv420p',D+'/build/silent.mp4'],stdin=subprocess.PIPE)
            for i in range(N):
                pg.evaluate(f'blur({i/fps},6,{0.5/fps})');ff.stdin.write(pg.screenshot(type='jpeg',quality=95))
                if i%300==0:print(i,N,flush=True)
            ff.stdin.close();ff.wait()
