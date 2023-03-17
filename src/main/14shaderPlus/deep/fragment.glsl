

precision lowp float;
varying vec2 vUv;
uniform float uTime;
uniform float uScale;
#define PI 3.1415926535897932384626433832795
// 随机函数
float random(vec2 st){
    return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);
}

// 旋转函数
vec2 rotate(vec2 uv, float rotation, vec2 mid)
{
    return vec2(
      cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
      cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
    );
}
// 噪声函数
float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}
void main(){
    // 1.通过顶点对应的uv,决定每一个像素在uv图形的位置,通过这个位置x,y决定颜色
    // gl_FragColor = vec4(vUv,0.0,1.0);

    // 2.对第一种变形
    // gl_FragColor = vec4(vUv,1,1);

    // 3.利用uv实现渐变效果,从左到右
    // vUv.x
    // float strength = vUv.x;
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 4.利用uv实现渐变效果,从下到上
    // vUv.y
    // float strength = vUv.y;
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 5.利用uv实现渐变效果,从上到下
    // vUv.y
    // float strength = 1.0 - vUv.y;
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 6.利用uv实现端范围内渐变
    // vUv.y
    // float strength = vUv.y * 2.0;
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 7.通过取模达到反复效果
    // vUv.y
    // float strength = mod(vUv.y * 10.0,1.0);
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 8.通过step函数实现斑马条纹
    // vUv.y
    // float strength = mod(vUv.y * 10.0,1.0);
    // strength = step(0.5,strength);
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 9.通过step函数实现斑马条纹
    // vUv.y
    // float strength = mod(vUv.x * 10.0,1.0);
    // strength = step(0.8,strength);
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 10.条纹相加
    // vUv.y
    // float strength =  step(0.8,mod(vUv.x * 10.0,1.0));
    // strength+= step(0.8,mod(vUv.y * 10.0,1.0));
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 11.条纹相乘
    // vUv.y
    // float strength =  step(0.8,mod(vUv.x * 10.0,1.0));
    // strength *= step(0.8,mod(vUv.y * 10.0,1.0));
    
    // 12.条纹相减
    // float strength =  step(0.8,mod(vUv.x * 10.0,1.0));
    // strength -= step(0.8,mod(vUv.y * 10.0,1.0));

    // 13.方块填充
    // float strength =  step(0.3,mod(vUv.x * 10.0,1.0));
    // strength *= step(0.2,mod(vUv.y * 10.0,1.0));

    // 13.T形图
    // float barX = step(0.4,mod((vUv.x+uTime*0.1) * 10.0,1.0))*step(0.8,mod(vUv.y * 10.0,1.0));
    // float barY = step(0.4,mod((vUv.y) * 10.0,1.0))*step(0.8,mod(vUv.x * 10.0,1.0));
    // float strength = barX+barY;


    // 14.偏移
    // float barX = step(0.4,mod((vUv.x) * 10.0-0.2,1.0))*step(0.8,mod(vUv.y * 10.0,1.0));
    // float barY = step(0.4,mod((vUv.y) * 10.0,1.0))*step(0.8,mod(vUv.x * 10.0,1.0));
    // float strength = barX+barY;
    // gl_FragColor = vec4(vUv,1.0,strength);

    
    // 15.利用绝对值
    // float strength = abs(vUv.x-0.5);

    // 16.取最小值
    // float strength = min(abs(vUv.y-0.5),abs(vUv.x-0.5));

    // 17.取最大值
    // float strength = 1.0-max(abs(vUv.y-0.5),abs(vUv.x-0.5));

    // 18.step
    // float strength = step(0.2,max(abs(vUv.y-0.5),abs(vUv.x-0.5)));

    // 19.step
    // float strength = 1.0-step(0.2,max(abs(vUv.y-0.5),abs(vUv.x-0.5)));

    // 20.step
    // float strength = step(0.2,max(abs(vUv.y-0.5),abs(vUv.x-0.5)));
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 21.利用取整，实现条纹渐变
    // float strength = floor(vUv.x*10.0)/10.0;
    // float strength = floor(vUv.y*10.0)/10.0;
    // strength *= floor(vUv.x*10.0)/10.0;

    // 22.随机效果
    // float strength = random(vUv);

    // 23.随机+格子效果
    // float strength = ceil(vUv.x*10.0)/10.0*ceil(vUv.y*10.0)/10.0;
    // strength = random(vec2(strength,strength));

    // 24.依据length返回向量长度
    // float strength = length(vUv);
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // // 25.根据distance计算2个向量的距离
    // float strength = 1.0 -distance(vUv,vec2(0.5,0.5));
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 27.根据相除，实现星星

    // float strength = 0.15/distance(vUv,vec2(0.5,0.5));
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 28.根据相除，实现星星
    // float strength = 0.15/distance(vec2(vUv.x,(vUv.y-0.5)*5.0),vec2(0.5,0.5))-1.0;

    // 29.十字交叉的星星
    // float strength = 0.15/distance(vec2(vUv.x,(vUv.y-0.5)*5.0+0.5),vec2(0.5,0.5))-1.0;
    // strength += 0.15/distance(vec2((vUv.x-0.5)*5.0+0.5,vUv.y),vec2(0.5,0.5))-1.0;
    
    // 30.旋转飞镖
    //  vec2 rotateUv = rotate(vUv,3.14*0.25,vec2(0.5));
    // vec2 rotateUv = rotate(vUv,uTime,vec2(0.5));
    // float strength = 0.15/distance(vec2(rotateUv.x,(rotateUv.y-0.5)*5.0+0.5),vec2(0.5,0.5))-1.0;
    // strength += 0.15/distance(vec2((rotateUv.x-0.5)*5.0+0.5,rotateUv.y),vec2(0.5,0.5))-1.0;

    // 31. 小日本国旗
    // float strength = step(0.5,distance(vUv,vec2(0.5))+0.25);
    // gl_FragColor = vec4(strength,strength,strength,1);
    // float strength = 1.0-step(0.5,distance(vUv,vec2(0.5))+0.25);
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 32. 圆环
    // float strength = step(0.5,distance(vUv,vec2(0.5))+0.35);
    // strength *= (1.0-step(0.5,distance(vUv,vec2(0.5))+0.25));
    // gl_FragColor = vec4(strength,strength,strength,strength);
    
    // 33. 渐变环
    // float strength =abs(distance(vUv,vec2(0.5))-0.25);
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 34.圆环
    // float strength =step(0.1,abs(distance(vUv,vec2(0.5))-0.25));
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 35.枪靶
    // float strength =step(0.2,mod(abs(distance(vUv,vec2(0.5))-0.25)*10.0,1.0));
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 36.圆环
    // float strength =1.0-step(0.1,abs(distance(vUv,vec2(0.5))-0.25));
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 37.波浪环
    // vec2 waveUv = vec2(
    //     vUv.x,
    //     vUv.y+sin(vUv.x*30.0)*0.1
    // );
    // float strength = 1.0-step(0.01,abs(distance(waveUv,vec2(0.5))-0.25));
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // // 38.波浪
    // vec2 waveUv = vec2(
    //     vUv.x+sin(vUv.y*30.0)*0.1,
    //     vUv.y+sin(vUv.x*30.0)*0.1
    // );
    // float strength = 1.0-step(0.01,abs(distance(waveUv,vec2(0.5))-0.25));
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // // 39.波浪
    // vec2 waveUv = vec2(
    //     vUv.x+sin(vUv.y*100.0)*0.1,
    //     vUv.y+sin(vUv.x*100.0)*0.1
    // );
    // float strength = 1.0-step(0.01,abs(distance(waveUv,vec2(0.5))-0.25));
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 40.根据角度显示视图
    // float angle = atan(vUv.x,vUv.y);
    // float strength = angle;
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 41.根据角度实现螺旋渐变
    // float angle = atan(vUv.x-0.5,vUv.y-0.5);
    // float strength = (angle+3.14)/6.28;
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 42.实现雷达扫射
    
    // float alpha = 1.0-step(0.5,abs(distance(vUv,vec2(0.5))));
    // float angle = atan(vUv.x-0.5,vUv.y-0.5);
    // float strength = (angle+3.14)/6.28;
    // gl_FragColor = vec4(strength,strength,strength,alpha);

    // 43.通过实践实现动态旋转
    // vec2 rotateUv = rotate(vUv,3.14*0.25,vec2(0.5));
    // vec2 rotateUv = rotate(vUv,-uTime*5.0,vec2(0.5));
    // float alpha = 1.0-step(0.5,abs(distance(rotateUv,vec2(0.5))));
    // float angle = atan(rotateUv.x-0.5,rotateUv.y-0.5);
    // float strength = (angle+3.14)/6.28;
    // gl_FragColor = vec4(strength,strength,strength,alpha);

    // 44.实现万花筒
    // float angle = atan(vUv.x-0.5,vUv.y-0.5)/PI;
    // float strength = mod(angle*10.0,1.0);
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 45.光芒四射
    // float angle = atan(vUv.x-0.5,vUv.y-0.5)/(2.0*PI);
    // float strength = sin(angle*100.0);
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // 46.使用噪声实现烟雾 / 波纹效果
    // float strength = noise(vUv);
    // gl_FragColor = vec4(strength,strength,strength,1.0);

    // float strength = noise(vUv*10.0);
    // gl_FragColor = vec4(strength,strength,strength,1.0);
    // 47 .通过实践设置波形
    // float strength = step(uScale,noise(vUv*10.0+uTime));
    // gl_FragColor = vec4(strength,strength,strength,1.0);
    
    // 48 .通过实践设置波形
    float strength = 1.0-abs(noise(vUv*10.0));
    gl_FragColor = vec4(strength,strength,strength,1.0);
}