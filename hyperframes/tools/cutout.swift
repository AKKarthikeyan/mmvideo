import Foundation
import Vision
import CoreImage
import AppKit
// usage: cutout in.jpg out.png  -> subject on transparent background (Apple Vision subject lifting)
let a = CommandLine.arguments
let url = URL(fileURLWithPath: a[1])
guard let ci = CIImage(contentsOf: url) else { print("cannot read"); exit(1) }
let req = VNGenerateForegroundInstanceMaskRequest()
let h = VNImageRequestHandler(ciImage: ci)
try h.perform([req])
guard let obs = req.results?.first else { print("no subject"); exit(2) }
let buf = try obs.generateMaskedImage(ofInstances: obs.allInstances, from: h, croppedToInstancesExtent: true)
let out = CIImage(cvPixelBuffer: buf)
let ctx = CIContext()
try ctx.writePNGRepresentation(of: out, to: URL(fileURLWithPath: a[2]), format: .RGBA8, colorSpace: CGColorSpace(name: CGColorSpace.sRGB)!)
print("ok", a[2], Int(out.extent.width), Int(out.extent.height), "instances:", obs.allInstances.count)
