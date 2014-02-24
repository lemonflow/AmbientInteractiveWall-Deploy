var photoshopMath = [

"/*",
"** Photoshop & misc math",
"** Blending modes, RGB/HSL/Contrast/Desaturate, levels control",
"**",
"** Romain Dura | Romz",
"** Blog: http://blog.mouaif.org",
"** Post: http://blog.mouaif.org/?p=94",
"*/",


"/*",
"** Desaturation",
"*/",

"vec4 Desaturate(vec3 color, float Desaturation)",
"{",
	"vec3 grayXfer = vec3(0.3, 0.59, 0.11);",
	"vec3 gray = vec3(dot(grayXfer, color));",
	"return vec4(mix(color, gray, Desaturation), 1.0);",
"}",



].join("\n");