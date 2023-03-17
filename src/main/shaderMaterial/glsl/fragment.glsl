precision lowp float;
varying vec2 vUv;
varying float vEvlevtion;
uniform sampler2D uTexture;
void main(){
  float deep = (vEvlevtion+0.5)*10.0;
  // gl_FragColor = vec4(1.0*deep,0.0, 0.0,1.0);

  // 根据uv进行采样;
  vec4 TextureColor = texture2D(uTexture,vUv);
  TextureColor.rgb*=deep;
  gl_FragColor = TextureColor;
}