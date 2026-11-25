"""Karthigai Deepam 60 s (kd-deepam60): every shot built in code and rendered in Blender (AK, 24 Nov 2026: "Use MiniMax
for reference, made in code and render in Blender"; the gods are flat cut-outs from the MiniMax stills).

  blender -b -P scripts/deepam/blender/deepam3d.py -- k9               # render shot k9 -> public/deepam/clip3d/k9.mp4
  blender -b -P scripts/deepam/blender/deepam3d.py -- k9 --still 60    # one frame, half size, for look checks
  blender -b -P scripts/deepam/blender/deepam3d.py -- all

Look: flat ink colours from PALETTE, black Freestyle outlines on the 3D set (not on the cut-outs), fire made of animated
noise, embers as particles. Every move is a driver on the frame number, so any frame renders the same way on its own.
The cut-outs come from public/deepam/cut/ (scripts/deepam/cutout.swift, Apple Vision subject lift).
Then: DEEPAM_FILM=kd-deepam60 DEEPAM_CLIP=clip3d DEEPAM_GRADED=graded3d python3 scripts/deepam/film.py grade ... cut.
"""
import bpy, bmesh, math, os, random, subprocess, sys, pathlib, shutil

ROOT = pathlib.Path(__file__).resolve().parents[3]
CUT = ROOT / "public/deepam/cut"
OUT = ROOT / "public/deepam/clip3d"
TMP = pathlib.Path(os.environ.get("DEEPAM_TMP", "/tmp")) / "deepam3d"
W, H, FPS, N = 1080, 1920, 30, 180
PAL = {"ink": "#07070b", "night": "#0d1f52", "blue": "#2456b8", "sky": "#8fb2ea", "blood": "#6e0d12",
       "red": "#c4221a", "deepam": "#f2a900", "flame": "#ffe061", "earth": "#1a0f10"}
R = math.radians


def lin(h):
    c = [int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)]
    return tuple((x / 12.92) if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1.0,)


# ---- scene -----------------------------------------------------------------------------------------------------------
def reset(sky="night", sky_mix=0.35):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    sc = bpy.context.scene
    sc.render.engine = "BLENDER_EEVEE"
    sc.render.resolution_x, sc.render.resolution_y = W, H
    sc.render.fps = FPS; sc.frame_start, sc.frame_end = 1, N
    sc.view_settings.view_transform = "Standard"
    try:
        sc.eevee.taa_render_samples = 8
    except AttributeError:
        pass
    world = bpy.data.worlds.new("w"); sc.world = world
    try:
        world.use_nodes = True
    except AttributeError:
        pass
    bg = world.node_tree.nodes.get("Background") or world.node_tree.nodes.new("ShaderNodeBackground")
    a, b = lin(PAL[sky]), lin(PAL["ink"])
    bg.inputs["Color"].default_value = tuple(a[i] * sky_mix + b[i] * (1 - sky_mix) for i in range(3)) + (1,)
    out = [n for n in world.node_tree.nodes if n.type == "OUTPUT_WORLD"]
    out = out[0] if out else world.node_tree.nodes.new("ShaderNodeOutputWorld")
    world.node_tree.links.new(bg.outputs[0], out.inputs[0])
    # ink lines on the 3D set only
    sc.render.use_freestyle = True
    sc.render.line_thickness_mode = "ABSOLUTE"; sc.render.line_thickness = 3.0
    ink = bpy.data.collections.new("ink"); sc.collection.children.link(ink)
    vl = bpy.context.view_layer; fs = vl.freestyle_settings
    ls = fs.linesets[0] if fs.linesets else fs.linesets.new("ink")
    ls.select_by_collection = True; ls.collection = ink
    ls.select_silhouette = ls.select_border = True; ls.select_crease = False
    if ls.linestyle is None:
        ls.linestyle = bpy.data.linestyles.new("ink")
    ls.linestyle.color = lin(PAL["ink"])[:3]; ls.linestyle.thickness = 3.0
    return sc, ink


def link(ob, col=None):
    for c in list(ob.users_collection):
        c.objects.unlink(ob)
    (col or bpy.context.scene.collection).objects.link(ob)
    return ob


def drive(owner, path, expr, index=-1):
    fc = owner.driver_add(path, index) if index >= 0 else owner.driver_add(path)
    fc.driver.type = "SCRIPTED"; fc.driver.expression = expr
    return fc


# ---- materials -------------------------------------------------------------------------------------------------------
def _mat(name):
    m = bpy.data.materials.new(name)
    try:
        m.use_nodes = True
    except AttributeError:
        pass
    m.node_tree.nodes.clear()
    return m, m.node_tree.nodes, m.node_tree.links


def mat_flat(hexc, strength=1.0, name="flat"):
    m, n, l = _mat(name)
    o = n.new("ShaderNodeOutputMaterial"); e = n.new("ShaderNodeEmission")
    e.inputs["Color"].default_value = lin(hexc); e.inputs["Strength"].default_value = strength
    l.new(e.outputs[0], o.inputs[0]); return m


def mat_toon(dark, mid, light, name="toon"):
    """Two hard steps of light, like an ink fill with a cel shadow."""
    m, n, l = _mat(name)
    o = n.new("ShaderNodeOutputMaterial"); d = n.new("ShaderNodeBsdfDiffuse"); s = n.new("ShaderNodeShaderToRGB")
    r = n.new("ShaderNodeValToRGB"); e = n.new("ShaderNodeEmission")
    r.color_ramp.interpolation = "CONSTANT"
    r.color_ramp.elements[0].color = lin(dark); r.color_ramp.elements[1].position = 0.15
    r.color_ramp.elements[1].color = lin(mid); el = r.color_ramp.elements.new(0.55); el.color = lin(light)
    l.new(d.outputs[0], s.inputs[0]); l.new(s.outputs[0], r.inputs[0]); l.new(r.outputs[0], e.inputs[0])
    l.new(e.outputs[0], o.inputs[0]); return m


def mat_fire(alpha=True, scale=2.2, speed=0.05, strength=1.0, name="fire", cut=0.45, shift=0.0):
    """Animated noise mapped to red -> deepam -> flame; with alpha the edges break into flame tongues."""
    m, n, l = _mat(name)
    o = n.new("ShaderNodeOutputMaterial"); tc = n.new("ShaderNodeTexCoord"); mp = n.new("ShaderNodeMapping")
    nz = n.new("ShaderNodeTexNoise"); nz.noise_dimensions = "4D"
    nz.inputs["Scale"].default_value = scale; nz.inputs["Detail"].default_value = 6; nz.inputs["Roughness"].default_value = 0.6
    drive(nz.inputs["W"], "default_value", f"frame*{speed * 0.4:.4f}")
    drive(mp.inputs["Location"], "default_value", f"-frame*{speed:.4f}", 2)        # the pattern rises
    mp.inputs["Scale"].default_value = (1, 1, 0.35)                                 # stretched upward like flame
    c = n.new("ShaderNodeValToRGB"); cr = c.color_ramp; cr.interpolation = "LINEAR"
    cr.elements[0].position = 0.42 + shift; cr.elements[0].color = lin(PAL["red"])
    cr.elements[1].position = 0.64 + shift; cr.elements[1].color = lin(PAL["flame"])
    mid = cr.elements.new(0.53 + shift); mid.color = lin(PAL["deepam"])
    e = n.new("ShaderNodeEmission"); e.inputs["Strength"].default_value = strength
    l.new(tc.outputs["Object"], mp.inputs["Vector"]); l.new(mp.outputs[0], nz.inputs["Vector"])
    l.new(nz.outputs["Fac"], c.inputs[0]); l.new(c.outputs[0], e.inputs[0])
    if alpha:
        a = n.new("ShaderNodeValToRGB"); a.color_ramp.interpolation = "CONSTANT"
        a.color_ramp.elements[1].position = cut
        t = n.new("ShaderNodeBsdfTransparent"); mx = n.new("ShaderNodeMixShader")
        l.new(nz.outputs["Fac"], a.inputs[0]); l.new(a.outputs[0], mx.inputs[0])
        l.new(t.outputs[0], mx.inputs[1]); l.new(e.outputs[0], mx.inputs[2]); l.new(mx.outputs[0], o.inputs[0])
        _dither(m)
    else:
        l.new(e.outputs[0], o.inputs[0])
    return m


def _dither(m):
    for attr, val in (("surface_render_method", "DITHERED"), ("blend_method", "HASHED")):
        try:
            setattr(m, attr, val); return
        except (AttributeError, TypeError):
            pass


def mat_image(path, strength=1.0, name="cut"):
    m, n, l = _mat(name)
    o = n.new("ShaderNodeOutputMaterial"); t = n.new("ShaderNodeTexImage"); t.image = bpy.data.images.load(str(path))
    t.extension = "CLIP"
    e = n.new("ShaderNodeEmission"); e.inputs["Strength"].default_value = strength
    tr = n.new("ShaderNodeBsdfTransparent"); mx = n.new("ShaderNodeMixShader")
    l.new(t.outputs["Color"], e.inputs[0]); l.new(t.outputs["Alpha"], mx.inputs[0])
    l.new(tr.outputs[0], mx.inputs[1]); l.new(e.outputs[0], mx.inputs[2]); l.new(mx.outputs[0], o.inputs[0])
    _dither(m); return m, t.image


def mat_points(hexc, strength=3.0):
    return mat_flat(hexc, strength, "points")


# ---- set pieces ------------------------------------------------------------------------------------------------------
def cutout(name, width, loc, rot=(90, 0, 0), strength=1.0):
    """A flat cut-out from public/deepam/cut/<name>.png, standing upright and facing the camera (-Y)."""
    m, img = mat_image(CUT / f"{name}.png", strength, f"cut_{name}")
    bpy.ops.mesh.primitive_plane_add(size=1, location=loc)
    ob = bpy.context.active_object; ob.name = f"cut_{name}"
    ob.scale = (width, width * img.size[1] / img.size[0], 1); ob.rotation_euler = tuple(R(a) for a in rot)
    ob.data.materials.append(m); link(ob); return ob


def displaced(ob, strength, size, mover=None, ink=None):
    tex = bpy.data.textures.new(f"tx_{ob.name}", "CLOUDS"); tex.noise_scale = size
    d = ob.modifiers.new("disp", "DISPLACE"); d.texture = tex; d.strength = strength
    if mover is not None:
        d.texture_coords = "OBJECT"; d.texture_coords_object = mover
    return d


def subdivided_cylinder(r, depth, loc, cuts, verts=64):
    bpy.ops.mesh.primitive_cylinder_add(vertices=verts, radius=r, depth=depth, location=loc, end_fill_type="NOTHING")
    ob = bpy.context.active_object
    bm = bmesh.new(); bm.from_mesh(ob.data)
    vert_edges = [e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) > 1e-6]
    bmesh.ops.subdivide_edges(bm, edges=vert_edges, cuts=cuts, use_grid_fill=False)
    bm.to_mesh(ob.data); bm.free(); return ob


def pillar(r=1.3, height=80, z0=-40, x=0.0, y=0.0, embers=True, ink=None, grow=None, halves=None):
    """(No ink lines on the fire: Freestyle on the dense rippling meshes cost ~17 s a frame.) The pillar of fire: a bright core, a flickering shell whose surface ripples upward, and sparse red tongues.
    grow: driver expression for the z scale (0..1) from the bottom. halves: an expression for how far the two halves
    part (Shiva steps out of the gap); then the core is replaced by a flat wall of fire behind the gap."""
    mover = bpy.data.objects.new("fire_mover", None); link(mover); drive(mover, "location", "-frame*0.12", 2)
    layers = [  # (radius, cuts, material, displacement strength, size)
        (r, 120, lambda: mat_fire(alpha=True, name="shell", cut=0.47, shift=0.03), 1.0, 0.8),
        (r * 1.45, 140, lambda: mat_fire(alpha=True, scale=1.4, speed=0.09, name="tongues", cut=0.56, shift=0.12), 1.4, 0.7)]
    parts = []
    if halves:
        bpy.ops.mesh.primitive_plane_add(size=1, location=(x, y + r * 0.4, z0 + height / 2))
        wall = bpy.context.active_object; wall.scale = (r * 3.2, height, 1); wall.rotation_euler = (R(90), 0, 0)
        wall.data.materials.append(mat_fire(alpha=False, scale=1.2, speed=0.06, strength=1.2, name="wall", shift=-0.1))
        link(wall); parts.append(wall)
        for rad, cuts, mk, st, sz in layers:
            for side in (-1, 1):
                sh = subdivided_cylinder(rad, height, (x, y, z0 + height / 2), cuts)
                bm = bmesh.new(); bm.from_mesh(sh.data)
                bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.x * side < -1e-4], context="VERTS")
                bm.to_mesh(sh.data); bm.free()
                sh.data.materials.append(mk()); displaced(sh, st, sz, mover)
                drive(sh, "location", f"{x}+{side}*({halves})", 0); link(sh); parts.append(sh)
    else:
        core = subdivided_cylinder(r * 0.55, height, (x, y, z0 + height / 2), 40)
        core.data.materials.append(mat_fire(alpha=False, scale=1.6, speed=0.06, strength=1.2, name="core", shift=-0.08))
        displaced(core, 0.25, 1.2, mover); link(core); parts.append(core)
        for rad, cuts, mk, st, sz in layers:
            sh = subdivided_cylinder(rad, height, (x, y, z0 + height / 2), cuts)
            sh.data.materials.append(mk()); displaced(sh, st, sz, mover); link(sh); parts.append(sh)
    if grow:
        import mathutils
        for p in parts:
            p.data.transform(mathutils.Matrix.Translation((0, 0, height / 2) if p.type == "MESH" and p.rotation_euler.x == 0 else (0, 0, 0)))
            p.location.z = z0; drive(p, "scale", grow, 2)
    if embers:
        ember_field(parts[-1], 500)
    return parts


def ember_field(emitter, count=400):
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=0.05, location=(0, 0, -500))
    dot = bpy.context.active_object; dot.data.materials.append(mat_points(PAL["flame"], 4.0)); link(dot)
    ps = emitter.modifiers.new("embers", "PARTICLE_SYSTEM").particle_system.settings
    ps.count = count; ps.frame_start = -150; ps.frame_end = N; ps.lifetime = 110; ps.lifetime_random = 0.6
    ps.emit_from = "FACE"; ps.normal_factor = 0.8; ps.factor_random = 0.6
    ps.effector_weights.gravity = -0.12; ps.render_type = "OBJECT"; ps.instance_object = dot
    ps.particle_size = 1.0; ps.size_random = 0.7
    emitter.show_instancer_for_render = True


def stars(n=600, y=120, spread=(160, 260), zc=40, seed=3):
    rnd = random.Random(seed); me = bpy.data.meshes.new("stars"); bm = bmesh.new()
    for _ in range(n):
        x, z, s = rnd.uniform(-spread[0] / 2, spread[0] / 2), zc + rnd.uniform(-spread[1] / 2, spread[1] / 2), rnd.uniform(0.05, 0.16)
        v = [bm.verts.new((x + dx * s, y, z + dz * s)) for dx, dz in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
        bm.faces.new(v)
    bm.to_mesh(me); bm.free(); ob = bpy.data.objects.new("stars", me)
    ob.data.materials.append(mat_flat(PAL["sky"], 2.0, "star")); link(ob); return ob


def hill(radius=40, height=26, loc=(0, 70, 0), ink=None, summit_fire=True, scale_expr=None):
    bpy.ops.mesh.primitive_cone_add(vertices=128, radius1=radius, radius2=radius * 0.06, depth=height,
                                    location=(loc[0], loc[1], loc[2] + height / 2))
    ob = bpy.context.active_object; ob.name = "arunachala"
    bm = bmesh.new(); bm.from_mesh(ob.data)
    bmesh.ops.subdivide_edges(bm, edges=[e for e in bm.edges if abs(e.verts[0].co.z - e.verts[1].co.z) > 1e-6], cuts=24)
    bm.to_mesh(ob.data); bm.free()
    displaced(ob, height * 0.05, height * 0.12)
    ob.data.materials.append(mat_toon(PAL["ink"], PAL["ink"], PAL["blood"], "hill")); link(ob, ink)
    top = loc[2] + height
    fire = None
    if summit_fire:
        bpy.ops.mesh.primitive_uv_sphere_add(radius=radius * 0.09, location=(loc[0], loc[1], top + radius * 0.02))
        fire = bpy.context.active_object; fire.scale = (1, 1, 1.6)
        fire.data.materials.append(mat_fire(alpha=True, scale=3.5, speed=0.08, strength=4.0, name="summit"))
        mover = bpy.data.objects.new("summit_mover", None); link(mover); drive(mover, "location", "-frame*0.2", 2)
        displaced(fire, radius * 0.05, radius * 0.05, mover); link(fire)
        ember_field(fire, 300)
    if scale_expr:
        for o in (ob, fire):
            if o:
                o.parent = None
        # the hill rises from the ground: origin at the base
        ob.data.transform(__import__("mathutils").Matrix.Translation((0, 0, height / 2))); ob.location.z = loc[2]
        drive(ob, "scale", scale_expr, 2)
    return ob, fire


def gopuram(loc, tiers=7, base=6.0, height=14.0, ink=None):
    """A temple gateway tower: stacked tapering storeys, crimson with black ink edges."""
    m = mat_toon(PAL["blood"], PAL["red"], PAL["red"], "gopuram"); z = loc[2]; w = base; th = height / (tiers + 1)
    for i in range(tiers):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(loc[0], loc[1], z + th / 2))
        c = bpy.context.active_object; c.scale = (w, w * 0.55, th); c.data.materials.append(m); link(c, ink)
        z += th; w *= 0.84
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=w * 0.5, depth=th * 0.9, location=(loc[0], loc[1], z + th * 0.45))
    c = bpy.context.active_object; c.rotation_euler = (0, R(90), 0); c.data.materials.append(m); link(c, ink)


def lamp_row(y0, y1, half_width, step=1.6):
    """Clay lamps (agal vilakku) lining both sides of the path."""
    clay = mat_toon(PAL["blood"], PAL["red"], PAL["red"], "clay"); flame = mat_fire(alpha=False, scale=6, speed=0.2, strength=1.5, name="lampf")
    y = y0
    while y < y1:
        for side in (-1, 1):
            bpy.ops.mesh.primitive_uv_sphere_add(radius=0.18, location=(side * half_width, y, 0.08))
            l = bpy.context.active_object; l.scale = (1, 1, 0.45); l.data.materials.append(clay); link(l)
            bpy.ops.mesh.primitive_cone_add(radius1=0.07, depth=0.28, location=(side * half_width, y, 0.28))
            f = bpy.context.active_object; f.data.materials.append(flame); link(f)
        y += step


def ground(z=0, color="ink", size=600):
    bpy.ops.mesh.primitive_plane_add(size=size, location=(0, size / 2 - 20, z))
    g = bpy.context.active_object; g.data.materials.append(mat_flat(PAL[color], 1.0, "ground")); link(g); return g


def sun_light(energy=3.0, rot=(50, 0, 30)):
    s = bpy.data.lights.new("sun", "SUN"); s.energy = energy; ob = bpy.data.objects.new("sun", s)
    ob.rotation_euler = tuple(R(a) for a in rot); link(ob); return ob


def fire_light(loc, energy=6000, color="deepam"):
    p = bpy.data.lights.new("firelight", "POINT"); p.energy = energy; p.color = lin(PAL[color])[:3]
    ob = bpy.data.objects.new("firelight", p); ob.location = loc; link(ob); return ob


def camera(loc, rot=(90, 0, 0), lens=30, drivers=None):
    c = bpy.data.cameras.new("cam"); c.lens = lens; c.clip_end = 2000
    ob = bpy.data.objects.new("cam", c); ob.location = loc; ob.rotation_euler = tuple(R(a) for a in rot)
    link(ob); bpy.context.scene.camera = ob
    for (path, idx), expr in (drivers or {}).items():
        drive(ob, path, expr, idx)
    return ob


def ring(radius_expr, z, y=0.0, color="flame", fade=None):
    bpy.ops.mesh.primitive_torus_add(major_radius=1, minor_radius=0.04, location=(0, y, z))
    t = bpy.context.active_object; t.rotation_euler = (R(90), 0, 0)
    t.data.materials.append(mat_flat(PAL[color], 3.0, "ring")); link(t)
    for i in (0, 1, 2):
        drive(t, "scale", radius_expr, i)
    return t


def rock_band(z0, z1, x0=-12, x1=12, y=3.0, n=160, seed=5, ink=None):
    rnd = random.Random(seed)
    mats = [mat_toon(PAL["ink"], PAL["blood"], PAL["red"], "rockA"), mat_toon(PAL["ink"], PAL["ink"], PAL["blood"], "rockB")]
    for i in range(n):
        x = rnd.uniform(x0, x1)
        if abs(x) < 1.6:
            continue
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=rnd.uniform(0.4, 1.6),
                                              location=(x, y + rnd.uniform(0, 6), rnd.uniform(z0, z1)))
        r = bpy.context.active_object; r.scale = (1, rnd.uniform(0.6, 1), rnd.uniform(0.4, 0.8))
        r.rotation_euler = (rnd.random() * 3, rnd.random() * 3, rnd.random() * 3)
        r.data.materials.append(mats[i % 2]); link(r, ink)


# ---- shots -----------------------------------------------------------------------------------------------------------
# Each shot is 6 s (180 frames), like a Hailuo clip, so PLAN60 in film.py works unchanged.
def k1():   # the hill-lamp at night, temple towers and lamps lining the way, push in toward the summit
    sc, ink = reset(); stars(); ground()
    hill(radius=46, height=38, loc=(0, 62, 0), ink=ink)
    for i, yy in enumerate((4, 13, 24)):
        for side in (-1, 1):
            gopuram((side * (6.5 + i * 1.6), yy, 0), tiers=6, base=4.2 - i * 0.6, height=11 - i * 2, ink=ink)
    lamp_row(0.0, 44, 2.2)
    sun_light(1.5, (60, 0, -40)); fire_light((0, 62, 44), 600000)
    camera((0, -12, 1.2), (94, 0, 0), 24, {("location", 1): "-12+frame*0.03", ("rotation_euler", 0): "1.641+frame*0.0002"})

def k2():   # devotees, joined hands raised, the burning hill beyond; tilt up
    sc, ink = reset(); stars(); ground()
    hill(radius=46, height=38, loc=(0, 70, 0), ink=ink); fire_light((0, 70, 44), 600000)
    lamp_row(4, 50, 3.0)
    cutout("k2", 4.8, (0, -8.2, 0.75))   # drawn in code by scripts/deepam/crowd.py   # bottom edge on the ground line
    camera((0, -12, 0.7), (97, 0, 0), 30, {("rotation_euler", 0): "1.693+frame*0.0004"})

def k3():   # the swan climbs beside the endless pillar; the camera rises with it
    sc, ink = reset(); stars(y=60); pillar(ink=ink)
    sw = cutout("k3", 3.2, (-2.6, -1.6, -2)); drive(sw, "location", "-2+frame*0.075", 2)
    fire_light((0, -3, 0), 3000)
    camera((0, -13, 0), (90, 0, 0), 32, {("location", 2): "frame*0.07"})


def k4():   # the boar digs down through rock beside the pillar; the camera sinks with it
    sc, ink = reset("blood", 0.55); pillar(ink=ink, embers=False)
    rock_band(-40, 12, ink=ink); sun_light(2.0, (40, 0, 20)); fire_light((0, -3, 0), 4000, "flame")
    b = cutout("k4", 3.4, (1.7, -3.0, 2))   # in front of the pillar edge, so the black boar reads against the fire
    drive(b, "location", "2-frame*0.07", 2)
    camera((0, -13, 1.5), (92, 0, 0), 32, {("location", 2): "1.5-frame*0.068"})


def k5():   # looking straight up the pillar into the stars; crane up
    sc, ink = reset(); stars(y=40, spread=(200, 300), zc=120); pillar(height=300, z0=-60, ink=ink)
    camera((0, -7, -4), (150, 0, 0), 22, {("location", 2): "-4+frame*0.05"})


def k6():   # the signature shot: the pillar parts and Shiva stands in the gap
    sc, ink = reset(); stars(y=60)
    pillar(r=2.2, ink=ink, halves="min(3.4,max(0,(frame-10))*0.03)")
    sh = cutout("k6", 5.4, (0, 0.2, 0.2), strength=1.05)
    drive(sh, "location", "0.2-min(frame,180)*0.008", 1)
    fire_light((0, -4, 1), 5000, "flame")
    camera((0, -12, 0.6), (90, 0, 0), 32, {("location", 1): "-12+frame*0.018"})

def k7():   # the pillar sinks while the hill rises in its place
    sc, ink = reset(); stars(y=80); ground()
    for part in pillar(r=2.0, height=60, z0=0, y=40, ink=ink):   # the fire sinks into the ground
        drive(part, "location", f"{part.location.z:.3f}-min(frame,150)*0.42", 2)
    hill(radius=30, height=22, loc=(0, 40, 0), ink=ink, summit_fire=False, scale_expr="min(1,0.05+frame/150)")
    fire_light((0, 30, 10), 200000)
    camera((0, -30, 6), (92, 0, 0), 30, {("location", 1): "-30+frame*0.02"})


def k8():   # Brahma and Vishnu argue under a blood-red disc
    sc, ink = reset(); stars(y=60)
    bpy.ops.mesh.primitive_circle_add(vertices=96, radius=4.2, fill_type="NGON", location=(0, 20, 6.5))
    d = bpy.context.active_object; d.rotation_euler = (R(90), 0, 0)
    d.data.materials.append(mat_flat(PAL["red"], 1.0, "disc")); link(d)
    cutout("k8", 7.0, (0, 0, 0.2))
    camera((0, -12, 0.5), (90, 0, 0), 32, {("location", 1): "-12+frame*0.018"})


def k9():   # the pillar erupts and splits the sky; shock rings; two small gods thrown back
    sc, ink = reset(); stars(y=60); ground(-6)
    pillar(r=1.6, height=120, z0=-6, ink=ink, grow="min(1,max(0.01,(frame-4)/26))")
    for k, start in enumerate((6, 22, 40)):
        ring(f"max(0.01,(frame-{start})*0.35)", -5.5 + 0.0 * k)
    cutout("k8", 2.6, (0, -3, -4.6), strength=0.12)   # tiny dark figures, no Shiva yet
    fire_light((0, -4, 0), 6000, "flame")
    camera((0, -20, 1.5), (88, 0, 0), 30, {("location", 1): "-20+frame*0.04"})


def k10():  # Vishnu, alone and honest, in the fire's light
    sc, ink = reset(); stars(y=60); pillar(r=1.8, x=3.8, y=5, ink=ink)
    cutout("k10", 3.3, (-0.9, 0, 0.2)); fire_light((3, -2, 2), 3000)
    camera((0, -12, 0.8), (90, 0, 0), 32, {("location", 1): "-12+frame*0.012"})


def k11():  # the thalampoo falls past the fire; the swan far below
    sc, ink = reset(); stars(y=60); pillar(x=-3.6, ink=ink)
    f = cutout("k11", 1.3, (0.8, -1, 6))
    drive(f, "location", "6-frame*0.065", 2); drive(f, "rotation_euler", "0.25*sin(frame*0.05)", 1)
    cutout("k3", 1.3, (1.6, 2, -6.2), strength=0.8)
    camera((0, -12, 0), (90, 0, 0), 32, {("location", 2): "-frame*0.02"})


def k13():  # Brahma and Vishnu kneel before the towering fire, Shiva in it; tilt up
    sc, ink = reset(); stars(y=60); ground(-3)
    pillar(r=3.0, y=6, ink=ink)
    cutout("k13", 6.2, (0, -0.5, 1.6))
    camera((0, -14, -0.5), (86, 0, 0), 30, {("rotation_euler", 0): "1.501+frame*0.0009"})


def k14():  # the thalampoo cast aside on the bottom step; the lingam with its lamps at the top; slow track
    sc, ink = reset("blood", 0.2)
    m_step = mat_toon(PAL["ink"], PAL["night"], PAL["night"], "step"); rise, run = 0.45, 1.1
    for i in range(6):
        bpy.ops.mesh.primitive_cube_add(size=1, location=(0, i * run, i * rise - rise / 2))
        st = bpy.context.active_object; st.scale = (16, run, rise); st.data.materials.append(m_step); link(st, ink)
    top = 5 * rise; ly = 5 * run + 0.2
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, ly + 3, 4)); wall = bpy.context.active_object
    wall.scale = (40, 14, 1); wall.rotation_euler = (R(90), 0, 0); wall.data.materials.append(mat_flat(PAL["blood"], 1.0, "wall")); link(wall)
    stone = mat_toon(PAL["ink"], PAL["ink"], PAL["night"], "stone")
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=1.0, depth=0.35, location=(0, ly, top + 0.18))
    yoni = bpy.context.active_object; yoni.data.materials.append(stone); link(yoni, ink)
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=0.42, depth=1.0, location=(0, ly, top + 0.85))
    lg = bpy.context.active_object; lg.data.materials.append(stone); link(lg, ink)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.42, location=(0, ly, top + 1.35))
    cap = bpy.context.active_object; cap.data.materials.append(stone); link(cap, ink)
    clay = mat_toon(PAL["blood"], PAL["red"], PAL["red"], "clay")
    for i in range(11):
        a = R(190 + i * 16); x, yy = 1.7 * math.cos(a), ly + 0.9 * math.sin(a)
        bpy.ops.mesh.primitive_uv_sphere_add(radius=0.16, location=(x, yy, top + 0.08))
        lamp = bpy.context.active_object; lamp.scale = (1, 1, 0.45); lamp.data.materials.append(clay); link(lamp, ink)
        bpy.ops.mesh.primitive_cone_add(radius1=0.06, depth=0.24, location=(x, yy, top + 0.26))
        fl = bpy.context.active_object; fl.data.materials.append(mat_fire(alpha=False, scale=6, speed=0.2, strength=1.5, name="lamp")); link(fl)
    fire_light((0, ly - 1, top + 1), 300, "deepam"); sun_light(0.8, (70, 0, 20))
    cutout("k14", 2.6, (-0.6, -0.2, 0.0 + 0.35))   # the flower lies on the lowest step, in shadow
    camera((-1.0, -2.8, 1.0), (80, 0, 0), 26, {("location", 0): "-1.0+frame*0.010"})

SHOTS = dict(k1=k1, k2=k2, k3=k3, k4=k4, k5=k5, k6=k6, k7=k7, k8=k8, k9=k9, k10=k10, k11=k11, k13=k13, k14=k14)


def render(name, still=None):
    if still is None and (OUT / f"{name}.mp4").exists() and not os.environ.get("DEEPAM_REDO"):
        print("SKIP", name, "(already rendered; DEEPAM_REDO=1 to redo)"); return
    SHOTS[name]()
    sc = bpy.context.scene
    if still is not None:
        sc.render.resolution_percentage = 50; sc.frame_set(still)
        sc.render.image_settings.file_format = "PNG"
        p = TMP / f"{name}_still.png"; TMP.mkdir(parents=True, exist_ok=True); sc.render.filepath = str(p)
        bpy.ops.render.render(write_still=True); print("STILL", p); return
    frames = TMP / name
    shutil.rmtree(frames, ignore_errors=True); frames.mkdir(parents=True)
    sc.render.image_settings.file_format = "JPEG"; sc.render.image_settings.quality = 95
    sc.render.filepath = str(frames / "f_")
    bpy.ops.render.render(animation=True)
    OUT.mkdir(parents=True, exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", str(FPS), "-i", str(frames / "f_%04d.jpg"),
                    "-c:v", "libx264", "-crf", "14", "-pix_fmt", "yuv420p", str(OUT / f"{name}.mp4")], check=True)
    shutil.rmtree(frames, ignore_errors=True); print("CLIP", OUT / f"{name}.mp4")


if __name__ == "__main__":
    args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    still = int(args[args.index("--still") + 1]) if "--still" in args else None
    names = [a for a in args if a in SHOTS or a == "all"]
    for n in (list(SHOTS) if names == ["all"] else names):
        render(n, still)
