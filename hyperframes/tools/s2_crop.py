"""Crop a Sentinel-2 L2A true-colour (TCI) window around a point, straight from the AWS COG bucket.

usage: s2_crop.py <scene id e.g. S2A_43QBB_20180118_0> <lat> <lon> <width km> <out.png>
"""
import os
import sys

import numpy as np
import rasterio
from PIL import Image
from rasterio.warp import transform
from rasterio.windows import from_bounds

os.environ.setdefault("CURL_CA_BUNDLE", "/root/.ccr/ca-bundle.crt")
scene, lat, lon, km, out = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]), sys.argv[5]
_, tile, date, _ = scene.split("_")
url = (f"https://sentinel-cogs.s3.us-west-2.amazonaws.com/sentinel-s2-l2a-cogs/{tile[:2]}/{tile[2]}/{tile[3:]}/"
       f"{date[:4]}/{int(date[4:6])}/{scene}_L2A/TCI.tif")
with rasterio.Env(GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR"), rasterio.open("/vsicurl/" + url) as src:
    xs, ys = transform("EPSG:4326", src.crs, [lon], [lat])
    w, h = km * 1000, km * 1000 * 9 / 16
    win = from_bounds(xs[0] - w / 2, ys[0] - h / 2, xs[0] + w / 2, ys[0] + h / 2, src.transform)
    rgb = src.read([1, 2, 3], window=win)
Image.fromarray(np.moveaxis(rgb, 0, -1)).save(out)
print(out, rgb.shape, url)
