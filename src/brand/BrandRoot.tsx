import React from "react";
import {Still} from "remotion";
import {BannerStill, LockupStill, LogoStill, WatermarkStill} from "./Brand";

export const BrandRoot: React.FC = () => (
  <>
    <Still id="logo" component={LogoStill} width={800} height={800}/>
    <Still id="lockup" component={LockupStill} width={1600} height={560}/>
    <Still id="watermark" component={WatermarkStill} width={150} height={150}/>
    <Still id="banner" component={BannerStill} width={2560} height={1440}/>
    <Still id="banner-guides" component={BannerStill as any} defaultProps={{guides: true}} width={2560} height={1440}/>
  </>
);
