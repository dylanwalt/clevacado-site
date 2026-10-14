#!/usr/bin/env python3
"""Copy the local dashboard into the static browser-only public preview."""
import json,shutil,sys
from pathlib import Path
root=Path(__file__).resolve().parents[4]
tools=root/'products/prototype/tools';sys.path.insert(0,str(tools))
import clevacado_stream_dashboard as dashboard
out=Path(__file__).resolve().parents[1]/'public/live';out.mkdir(parents=True,exist_ok=True)
page=dashboard.PAGE.replace('href="/testing.css"','href="./testing.css"').replace('src="/testing.js"','src="./testing.js"').replace('src="/insights.js"','src="./insights.js"').replace('src="/fft.js"','src="./fft.js"').replace('src="/retention.js"','src="./retention.js"').replace('src="/inference.js"','src="./inference.js"')
style='.demo-banner{display:flex;gap:12px;align-items:center;flex:none;font-size:10px;border:1px solid #ffc46b;padding:4px 8px;border-radius:8px;color:#ffc46b}.demo-banner a{color:#b5ed72}.demo-banner select{padding:2px;font-size:10px}.demo-banner span{flex:1}'
reference={k:v for k,v in dashboard.NOISE_REFERENCE.items() if k!='sources'}
page=page.replace('</head>','<style>'+style+'</style><script>window.DEMO_NOISE_REFERENCE='+json.dumps(reference)+';</script><script src="./demo.js"></script></head>')
page=page.replace('</body>','<script src="./inference.js"></script><script src="./demo-inference.js"></script></body>')
page=page.replace('ClevaCado Live Capture</title>','ClevaCado Live — simulated demo</title>')
(out/'index.html').write_text(page)
for src,dest in [('dashboard_testing.js','testing.js'),('dashboard_insights.js','insights.js'),('dashboard_testing.css','testing.css'),('dashboard_fft.js','fft.js'),('dashboard_retention.js','retention.js'),('dashboard_inference.js','inference.js')]:shutil.copy2(tools/src,out/dest)
print('Synced browser-only preview to',out)
