// Lift the subject(s) out of a still with Apple's Vision framework (macOS 14+), no model download.
// swift scripts/deepam/cutout.swift in.jpeg out.png [instance indexes, default all]
import Foundation
import Vision
import CoreImage
import AppKit

let a = CommandLine.arguments
guard a.count >= 3 else { print("usage: cutout in out.png [i j ...]"); exit(2) }
let url = URL(fileURLWithPath: a[1])
guard let ci = CIImage(contentsOf: url) else { print("cannot read \(a[1])"); exit(1) }
let req = VNGenerateForegroundInstanceMaskRequest()
let h = VNImageRequestHandler(ciImage: ci)
try h.perform([req])
guard let r = req.results?.first else { print("NO SUBJECT"); exit(3) }
var set = r.allInstances
if a.count > 3 { set = IndexSet(a[3...].compactMap { Int($0) }) }
print("instances:", r.allInstances.map { $0 }, "using:", set.map { $0 })
let buf = try r.generateMaskedImage(ofInstances: set, from: h, croppedToInstancesExtent: false)
let out = CIImage(cvPixelBuffer: buf)
let ctx = CIContext()
try ctx.writePNGRepresentation(of: out, to: URL(fileURLWithPath: a[2]), format: .RGBA8, colorSpace: CGColorSpaceCreateDeviceRGB())
print("wrote", a[2])
