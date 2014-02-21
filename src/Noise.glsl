/*#ifdef GL_ES
precision mediump float;
precision mediump int;
#endif*/

#define PROCESSING_TEXTURE_SHADER
#define ONE 0.00390625
#define ONEHALF 0.001953125

uniform vec2 texOffset;
uniform sampler2D permTexture;
uniform sampler1D simplexTexture;
uniform sampler2D gradTexture;

uniform float time;
uniform float xres;
uniform float yres;

#define NUM_MARKERS 2
uniform float markerPos[NUM_MARKERS];
uniform float markerAlpha[NUM_MARKERS];
uniform float markerStrength[NUM_MARKERS];


varying vec4 vertTexCoord;
varying vec4 vertColor;

/*
 * The interpolation function. This could be a 1D texture lookup
 * to get some more speed, but it's not the main part of the algorithm.
 */
float fade(float t) {
  // return t*t*(3.0-2.0*t); // Old fade, yields discontinuous second derivative
  return t*t*t*(t*(t*6.0-15.0)+10.0); // Improved fade, yields C2-continuous noise
}


/*
 * 2D classic Perlin noise. Fast, but less useful than 3D noise.
 */
float noise(vec2 P) {

  vec2 Pi = ONE*floor(P)+ONEHALF; // Integer part, scaled and offset for texture lookup
  vec2 Pf = fract(P);             // Fractional part for interpolation

  // Noise contribution from lower left corner
  vec2 grad00 = texture2D(permTexture, Pi).rg * 4.0 - 1.0;
  float n00 = dot(grad00, Pf);

  // Noise contribution from lower right corner
  vec2 grad10 = texture2D(permTexture, Pi + vec2(ONE, 0.0)).rg * 4.0 - 1.0;
  float n10 = dot(grad10, Pf - vec2(1.0, 0.0));

  // Noise contribution from upper left corner
  vec2 grad01 = texture2D(permTexture, Pi + vec2(0.0, ONE)).rg * 4.0 - 1.0;
  float n01 = dot(grad01, Pf - vec2(0.0, 1.0));

  // Noise contribution from upper right corner
  vec2 grad11 = texture2D(permTexture, Pi + vec2(ONE, ONE)).rg * 4.0 - 1.0;
  float n11 = dot(grad11, Pf - vec2(1.0, 1.0));

  // Blend contributions along x
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade(Pf.x));

  // Blend contributions along y
  float n_xy = mix(n_x.x, n_x.y, fade(Pf.y));

  // We're done, return the final noise value.
  return n_xy;
}

float noise(vec3 P) {

  vec3 Pi = ONE*floor(P)+ONEHALF; // Integer part, scaled so +1 moves one texel
                                  // and offset 1/2 texel to sample texel centers
  vec3 Pf = fract(P);     // Fractional part for interpolation

  // Noise contributions from (x=0, y=0), z=0 and z=1
  float perm00 = texture2D(permTexture, Pi.xy).a ;
  vec3  grad000 = texture2D(permTexture, vec2(perm00, Pi.z)).rgb * 4.0 - 1.0;
  float n000 = dot(grad000, Pf);
  vec3  grad001 = texture2D(permTexture, vec2(perm00, Pi.z + ONE)).rgb * 4.0 - 1.0;
  float n001 = dot(grad001, Pf - vec3(0.0, 0.0, 1.0));

  // Noise contributions from (x=0, y=1), z=0 and z=1
  float perm01 = texture2D(permTexture, Pi.xy + vec2(0.0, ONE)).a ;
  vec3  grad010 = texture2D(permTexture, vec2(perm01, Pi.z)).rgb * 4.0 - 1.0;
  float n010 = dot(grad010, Pf - vec3(0.0, 1.0, 0.0));
  vec3  grad011 = texture2D(permTexture, vec2(perm01, Pi.z + ONE)).rgb * 4.0 - 1.0;
  float n011 = dot(grad011, Pf - vec3(0.0, 1.0, 1.0));

  // Noise contributions from (x=1, y=0), z=0 and z=1
  float perm10 = texture2D(permTexture, Pi.xy + vec2(ONE, 0.0)).a ;
  vec3  grad100 = texture2D(permTexture, vec2(perm10, Pi.z)).rgb * 4.0 - 1.0;
  float n100 = dot(grad100, Pf - vec3(1.0, 0.0, 0.0));
  vec3  grad101 = texture2D(permTexture, vec2(perm10, Pi.z + ONE)).rgb * 4.0 - 1.0;
  float n101 = dot(grad101, Pf - vec3(1.0, 0.0, 1.0));

  // Noise contributions from (x=1, y=1), z=0 and z=1
  float perm11 = texture2D(permTexture, Pi.xy + vec2(ONE, ONE)).a ;
  vec3  grad110 = texture2D(permTexture, vec2(perm11, Pi.z)).rgb * 4.0 - 1.0;
  float n110 = dot(grad110, Pf - vec3(1.0, 1.0, 0.0));
  vec3  grad111 = texture2D(permTexture, vec2(perm11, Pi.z + ONE)).rgb * 4.0 - 1.0;
  float n111 = dot(grad111, Pf - vec3(1.0, 1.0, 1.0));

  // Blend contributions along x
  vec4 n_x = mix(vec4(n000, n001, n010, n011),
                 vec4(n100, n101, n110, n111), fade(Pf.x));

  // Blend contributions along y
  vec2 n_xy = mix(n_x.xy, n_x.zw, fade(Pf.y));

  // Blend contributions along z
  float n_xyz = mix(n_xy.x, n_xy.y, fade(Pf.z));

  // We're done, return the final noise value.
  return n_xyz;
}

vec3 HSBToRGB(vec3 colorIn) {

float h=colorIn.x;
float sl=colorIn.y;
float l=colorIn.z;

float v;
float r,g,b;

r = l; // default to gray
g = l;
b = l;

v = (l <= 0.5) ? (l * (1.0 + sl)) : (l + sl - l * sl);

if (v > 0.0) {

float m;
float sv;
int sextant;
float frac, vsf, mid1, mid2;


m = l + l - v;
sv = (v - m ) / v;
h *= 6.0;
sextant = int(h);
frac = h - float(sextant);
vsf = v * sv * frac;
mid1 = m + vsf;
mid2 = v - vsf;

if(sextant==0) {
   r = v;
   g = mid1;
   b = m;
}
else if(sextant==1) {
   r = mid2;
   g = v;
   b = m;
}
else if(sextant==2) {
   r = m;
   g = v;
   b = mid1;
}
else if(sextant==3) {
   r = m;
   g = mid2;
   b = v;
}
else if(sextant==4) {
   r = mid1;
   g = m;
   b = v;
}
else if(sextant==5) {
   r = v;
  g = m;
  b = mid2;
}

}

vec3 rgb;

rgb.r = r;
rgb.g = g;
rgb.b = b;

return rgb;

}


void main() {  

   float x = vertTexCoord.x / texOffset.x;
   x -= mod(x, 2.); 

   float y = vertTexCoord.y / texOffset.y;
   y -= mod(y, 2.); 
	
   float curve = sin(x * texOffset.x * 3.141 * 2. + time) * cos(time) * sin(time);
   curve *= .5;

   float verty = .5 - .125 * ((vertTexCoord.y * 2. - 1.));


   float n = noise(vec3(x / xres + time, y / yres + curve, time * .25));

   float grav = 0.;
   float alpha = 0.;

   for(int i = 0; i < NUM_MARKERS; i++) {

      if(markerPos[i] < 0.)
	continue;	

      float dist = distance(vec2(vertTexCoord.x, verty), vec2(markerPos[i], .5));
      dist /= (markerAlpha[i] * markerStrength[i]);
      dist = clamp(dist, 0., 1.);
      dist = 1. - cos(dist * 3.141);
      dist = clamp(dist, 0., 1.);
      dist = 1. - dist;
    
      grav += dist;
      alpha += markerAlpha[i] * dist;

   }

   grav = clamp(grav, 0., 1.);
   alpha = clamp(alpha, 0., 1.);

   float pow = 2.; // 1. // 3.
   float mult = 1.5 + alpha * grav * 5.;
 
   n = pow(n * mult, pow);
   n = clamp(n, 0., 1.);

   float fadey = 1. - abs(vertTexCoord.y * 2. - 1.);
   n *= pow(fadey, .75);

   vec3 colorHSB = vec3(200. / 360., .2, n * .75);
   vec3 colorRGB = HSBToRGB(colorHSB);

   
   gl_FragColor = vec4(colorRGB, 1.);

}