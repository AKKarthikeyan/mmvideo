import Foundation
import Vision
import CoreImage
// usage: facebox image -> prints face box in pixels (top-left origin) and chin/median points
let url = URL(fileURLWithPath: CommandLine.arguments[1])
let ci = CIImage(contentsOf: url)!
let W = ci.extent.width, H = ci.extent.height
let req = VNDetectFaceLandmarksRequest()
try VNImageRequestHandler(ciImage: ci).perform([req])
for f in req.results ?? [] {
    let b = f.boundingBox
    print(String(format: "face x=%.0f y=%.0f w=%.0f h=%.0f (img %.0fx%.0f)", b.minX*W, (1-b.maxY)*H, b.width*W, b.height*H, W, H))
    if let fc = f.landmarks?.faceContour {
        let pts = fc.pointsInImage(imageSize: CGSize(width: W, height: H)).map { String(format: "%.0f,%.0f", $0.x, H-$0.y) }
        print("contour", pts.joined(separator: " "))
    }
}
