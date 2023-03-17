varying float vElevtion;
uniform vec3 uHightColor;
uniform vec3 uLowColor;

void main(){
    float a = (vElevtion+1.0)/2.0;
    vec3 color = mix(uLowColor,uHightColor,a);
    gl_FragColor = vec4(color,1.0);
}