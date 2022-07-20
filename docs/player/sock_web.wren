import "meta" for Meta
import "random" for Random
class Asset{
static exists(p){exists_(p,Promise.new()).await}
foreign static exists_(a,b)
static loadString(p){loadString_(p,Promise.new()).await}
foreign static loadString_(a,b)
}
class Path{
static current{Meta.module(1)}
static resolve(p){resolve(Meta.module(1),p)}
foreign static resolve(a,b)
}
foreign class Buffer is Sequence{
construct new(n){}
static fromString(s){
var b=Buffer.new(s.byteCount)
b.setFromString(s)
return b
}
static fromUint8(a){
var b=new(a.count)
var i=0
for(c in a){
b.setUint8(i,c)
i=i+1
}
return b
}
static load(p){load_(p,Promise.new()).await}
foreign static load_(a,b)
foreign static fromBase64(a)
foreign count
foreign resize(a)
foreign getUint8(a)
foreign setUint8(a,b)
foreign fillUint8(a)
foreign toString
foreign asString
foreign toBase64
foreign setFromString(a)
iterate(i){
i=i ? i+1 : 0
return i<count ? i : false
}
iteratorValue(i){getUint8(i)}
toJSON{toBase64}
static fromJSON(a){a is String ? fromBase64(a): null}
}
foreign class StringBuilder{
construct new(){}
add(a){addString(a.toString)}
foreign addString(a)
foreign addByte(a)
foreign clear()
foreign toString
}
class Vec{
construct new(x,y){
_x=x
_y=y
}
construct of(a){
if(a is List){
_x=a[0]
_y=a[1]
}else{
_x=_y=0
}
}
static zero{new(0,0)}
x{_x}
y{_y}
x=(x){_x=x}
y=(y){_y=y}
rotation{_y.atan(_x)}
rotation=(a){
var n=length
_x=a.cos*n
_y=a.sin*n
}
rotate(a){
var c=a.cos
var s=a.sin
return Vec.new(_x*c-_y*s,_x*s+_y*c)
}
floor{Vec.new(_x.floor,_y.floor)}
ceil{Vec.new(_x.ceil,_y.ceil)}
round{Vec.new(_x.round,_y.round)}
isZero{_x==0&&_y==0}
length{(_x*_x+_y*_y).sqrt}
length=(t){
var n=length
if(n>0){
n=t/n
_x=_x*n
_y=_y*n
}
}
normalize{
var n=length
return n>0 ? Vec.new(_x/n,_y/n): Vec.zero
}
normalize(min,max){
var len=length
if(len<=min)return Vec.zero
len=((len-min)/(max-min)).min(1)/len
return Vec.new(_x*len,_y*len)
}
-{Vec.new(-_x,-_y)}
+(v){Vec.new(_x+v.x,_y+v.y)}
-(v){Vec.new(_x-v.x,_y-v.y)}
*(a){a is Num ? Vec.new(_x*a,_y*a): dot(a)}
/(k){Vec.new(_x/k,_y/k)}
==(v){v is Vec&&_x==v.x&&_y==v.y}
dot(v){_x*v.x+_y*v.y}
distance(v){
var x=_x-v.x
var y=_y-v.y
return(x*x+y*y).sqrt
}
lerp(v,t){Vec.new(_x+(v.x-_x)*t,_y+(v.y-_y)*t)}
step(v,d){
var x=v.x-_x
var y=v.y-_y
var n=(x*x+y*y).sqrt
if(n<=d||n==0)return Vec.new(v.x,v.y)
d=d/n
return Vec.new(x*d,y*d)
}
project(v){v*(dot(v)/v.dot(v))}
toString{"(%(_x), %(_y))"}
toJSON{[_x,_y]}
static fromJSON(a){
if(a is List&&a.count==2){
var x=a[0]
var y=a[1]
if(x is Num&&y is Num)return new(x,y)
}
return zero
}
}
class Transform{
construct new(){
_0=1
_1=0
_2=0
_3=1
_4=0
_5=0
}
construct new(n0,n1,n2,n3){
_0=n0
_1=n1
_2=n2
_3=n3
_4=0
_5=0
}
construct new(n0,n1,n2,n3,n4,n5){
_0=n0
_1=n1
_2=n2
_3=n3
_4=n4
_5=n5
}
[n]{n<3 ?(n<1 ? _0 :(n<2 ? _1 : _2)):(n<4 ? _3 :(n<5 ? _4 : _5))}
*(a){a is Vec ? Vec.new(_0*v.x+_2*v.y+_4,_1*v.x+_3*v.y+_5): Transform.mul_(this,a)}
then(a){Transform.mul_(a,this)}
static mul_(a,b){
var a0=a[0]
var a1=a[1]
var a2=a[2]
var a3=a[3]
var a4=a[4]
var a5=a[5]
var b0=b[0]
var b1=b[1]
var b2=b[2]
var b3=b[3]
var b4=b[4]
var b5=b[5]
return new(a0*b0+a2*b1,a1*b0+a3*b1,a0*b2+a2*b3,a1*b2+a3*b3,a0*b4+a2*b5+a4,a1*b3+a3*b5+a5)
}
toString{toJSON.toString}
toJSON{[_0,_1,_2,_3,_4,_5]}
static fromJSON(a){(a is List&&a.count==6)? new(a[0],a[1],a[2],a[3],a[4],a[5]): null}
static translate(x,y){new(1,0,0,1,x,y)}
static scale(a){scale(a,a)}
static scale(x,y){new(x,0,0,y)}
static rotate(a){
var c=a.cos
var s=a.sin
return new(c,s,-s,c)
}
}
class Color{
static rgb(r,g,b){rgb(r,g,b,1)}
foreign static rgb(a,b,c,d)
static hsl(h,s,l){hsl(h,s,l,1)}
foreign static hsl(a,b,c,d)
static black{#000}
static black(a){gray(0,a)}
static white{#fff}
static white(a){gray(1,a)}
static gray{#808080}
static gray(n){rgb(n,n,n,1)}
static gray(n,a){rgb(n,n,n,a)}
static red{#f00}
static green{#0f0}
static blue{#00f}
static yellow{#ff0}
static cyan{#0ff}
static magenta{#f0f}
foreign static toHexString(a)
static luma(c){(c.red*0.2126+c.green*0.7152+c.blue*0.0722)/255}
}
class Time{
static frame{__f}
static time{__t}
static delta{__d}
static update_(t,d){
__t=t
__d=d
}
static init_(){
__f=0
}
static pupdate_(){
__f=__f+1
}
}
Time.init_()
class Game{
foreign static title
foreign static title=(a)
static width{__w}
static width=(w){setSize(w,__h)}
static height{__h}
static height=(h){setSize(__w,h)}
static setSize(w,h){
__w=w
__h=h
__szf=true
layoutChanged_()
}
static clearSize(){
if(__szf){
__szf=false
__w=__wm
__h=__hm
layoutChanged_()
}
}
static pixelPerfectScaling{__pp}
static pixelPerfectScaling=(pp){
__pp=pp
layoutChanged_()
}
static maxScale{__km}
static maxScale=(s){
if(__km!=s){
__km=s
layoutChanged_()
}
}
foreign static fullscreen
static fullscreen=(v){
var a=setFullscreen_(v)
if(a is List)update_(a[0],a[1])
}
foreign static setFullscreen_(a)
foreign static scaleFilter
foreign static scaleFilter=(a)
foreign static fps
foreign static fps=(a)
static layoutChanged_(){
layoutChanged_(__w,__h,__szf,__pp,__km)
}
foreign static layoutChanged_(a,b,c,d,e)
foreign static cursor
foreign static cursor=(a)
static print(s){
__drawY=16+print_(s.toString,__drawX,__drawY)
}
static print(s,x,y){
__drawX=x
__drawY=16+print_(s.toString,x,y)
}
static printColor{__drawC}
static printColor=(c){
setPrintColor_(c)
__drawC=c
}
foreign static print_(a,b,c)
foreign static setPrintColor_(a)
static clear(){clear_(0,0,0)}
static clear(c){clear_(c.red/255,c.green/255,c.blue/255)}
foreign static clear_(a,b,c)
foreign static openURL(a)
static init_(w,h){
__w=__wm=w
__h=__hm=h
__km=Num.infinity
__szf=false
__pp=false
__drawX=__drawY=4
__drawC=Color.white
}
static update_(w,h){
__wm=w
__hm=h
if(!__szf){
__w=w
__h=h
}
}
static begin(fn){
if(__fn)Fiber.abort("Game.begin() alread called")
if(!(fn is Fn))Fiber.abort("update function is %(fn.type), should be a Fn")
if(fn.arity!=0)Fiber.abort("update function must have no arguments")
__fn=fn
ready_()
}
static update_(){
if(Input.held("F4"))quit()
__drawX=__drawY=4
if(__fn)__fn.call()
Input.pupdate_()
Time.pupdate_()
ready_()
}
foreign static ready_()
static quitNow(){
quit()
Fiber.suspend()
}
foreign static quit()
}
class Screen{
static size{Vec.of(sz_)}
static width{sz_[0]}
static height{sz_[1]}
static maxWindowSize{Vec.of(sza_)}
static maxWindowWidth{sza_[0]}
static maxWindowHeight{sza_[1]}
foreign static sz_
foreign static sza_
}
class Input{
static holdCutoff{__hc}
static holdCutoff=(value){__hc=value.clamp(0.001,1)}
static mouse{__ms}
static mouseDelta{__msd}
static mouseWheel{__mw}
static updateMouse_(x,y,w){
if(__ms){
__msd.x=x-__ms.x
__msd.y=y-__ms.y
__ms.x=x
__ms.y=y
}else{
__ms=Vec.new(x,y)
__msd=Vec.zero
}
__mw=w
}
static touches{__ts}
static touch(id){__ts.find{|t|t.id==id}}
static updateTouch_(i,d,f,x,y){
var t=touch(i)
if(t){
t.update_(d,f,x,y)
}else{
__ts.add(TouchInput.new(i,f,x,y))
}
}
static value(s){
var v=0
if(s is String){
var i=__i[s]
if(i)v=i.value
}else if(s is Sequence){
for(e in s){
var i=__i[e]
if(i)v=i.value.max(v)
}
}
return v
}
static value(neg,pos){
return value(pos)-value(neg)
}
static value(negX,posX,negY,posY){
return Vec.new(value(negX,posX),value(negY,posY))
}
static valuePressed(ids){
return pressed(ids)? 1 : 0
}
static valuePressed(neg,pos){
var np=pressed(neg)
var pp=pressed(pos)
return np==pp ? 0 :(pp ? 1 :-1)
}
static valuePressed(negX,posX,negY,posY){
return Vec.new(valuePressed(negX,posX),valuePressed(negY,posY))
}
static held(s){
if(s is String){
var i=__i[s]
if(i&&i.held)return true
}else if(s is Sequence){
for(e in s){
var i=__i[e]
if(i&&i.held)return true
}
}
return false
}
static pressed(s){
var p=false
if(s is String){
var i=__i[s]
if(i)p=i.pressed
}else if(s is Sequence){
for(e in s){
var i=__i[e]
if(i&&i.held){
if(!i.pressed)return false
p=true
}
}
}
return p
}
static released(s){
var r=false
if(s is String){
var i=__i[s]
if(i)r=i.released
}else if(s is Sequence){
for(e in s){
var i=__i[e]
if(i){
if(i.held)return false
r=r||i.released
}
}
}
return r
}
static whichPressed{
for(id in __i.keys){
if(__i[id].pressed)return id
}
}
static anyPressed{whichPressed!=null}
foreign static localize(a)
static update_(id,v){
var s=__i[id]
if(s){
s.update_(v)
}else{
__i[id]=s=InputState.new(id,v)
}
}
static textBegin(){textBegin(null)}
foreign static textBegin(a)
foreign static textDescription
foreign static textDescription=(a)
foreign static textString
foreign static textIsActive
foreign static textSelection
static init_(){
__i={}
__ts=[]
__hc=0.5
}
static pupdate_(){
__ts.removeWhere{|t|t.released}
}
}
Input.init_()
class InputState{
construct new(id,v){
_id=id
_v=v
_t=Time.frame
}
id{_id}
value{_v}
held{_v>Input.holdCutoff}
pressed{_t==Time.frame&&held}
released{_t==Time.frame&&!held}
update_(v){
var h=held
_v=v
if(h!=held)_t=Time.frame
}
}
class TouchInput{
construct new(i,f,x,y){
_i=i
_d=true
_f=f
_c=Vec.new(x,y)
_t=Time.frame
}
update_(d,f,x,y){
_f=f
_c.x=x
_c.y=y
if(d!=_d){
_d=d
_t=Time.frame
}
}
id{_i}
force{_f}
center{_c}
held{_d}
pressed{_t==Time.frame&&_d}
released{_t==Time.frame&&!_d}
x{_c.x}
y{_c.y}
}
class Promise{
construct new(){
_f=[]
_s=0
}
construct new_(f){
_f=[]
_v=f
_s=0
}
construct resolve(v){
_v=v
_s=1
_f=[]
}
isResolved{_s!=0}
isError{_s==2}
value{_s==1 ? _v : null}
error{_s==2 ? _v : null}
then(f){
return _s==0 ? _f.add(Promise.new_(f)): Promise.resolve(f.call(_v))
}
resolve_(ok,v){
if(_s==0){
_s=ok ? 1 : 2
_v=_v ? _v.call(v): v
}
while(!_f.isEmpty){
var f=_f[-1]
if(f is Fiber){
_f.removeAt(-1)
f.transfer(_v)
}
if(f is Promise){
f.resolve_(ok,v)
}else{
f.call(_v)
}
_f.removeAt(-1)
}
return true
}
await{
if(_s==0){
_f.add(Fiber.current)
Fiber.suspend()
}
if(_s==2)Fiber.abort(_v)
return _v
}
}
class Camera{
static center{Vec}
static center=(v){
__c.x=v.x
__c.y=v.y
update_()
}
static scale{__s}
static scale=(s){
__s=s
update_()
}
static topLeft{
return Vec.new(
__c.x-size.x/2,
__c.y-size.y/2
)
}
static setTopLeft(x,y){
__c.x=x+Game.width/2
__c.y=y+Game.height/2
update_()
}
static topLeft=(v){setTopLeft(v.x,v.y)}
static init_(){
__c=Vec.new(0,0)
__s=1
}
static update_(){update_(__c.x,__c.y,__s)}
foreign static update_(a,b,c)
}
Camera.init_()
Camera
foreign class Sprite{
static load(p){load_(p,Promise.new()).await}
foreign static load_(a,b)
foreign width
foreign height
foreign scaleFilter
foreign scaleFilter=(a)
foreign wrapMode
foreign wrapMode=(a)
foreign color
foreign color=(a)
foreign beginBatch()
foreign endBatch()
transform{
var t=transform_
return t&&Transform.new(t[0],t[1],t[2],t[3],t[4],t[5])
}
transform=(t){
if(t){
setTransform_(t[0],t[1],t[2],t[3],t[4],t[5])
}else{
setTransform_(Num.nan,0,0,0,0,0)
}
}
rotation=(a){transform=Transform.rotate(a)}
foreign transform_
foreign setTransform_(a,b,c,d,e,f)
transformOrigin{
var o=transformOrigin_
return o&&Vec.new(o[0],o[1])
}
transformOrigin=(o){
if(o){
setTransformOrigin(o.x,o.y)
}else{
setTransformOrigin(Num.nan,0)
}
}
foreign setTransformOrigin(a,b)
foreign transformOrigin_
draw(x,y){draw(x,y,0,width,height)}
draw(x,y,z){draw(x,y,z,width,height)}
draw(x,y,w,h){draw(x,y,0,w,h)}
draw(x,y,w,h,u,v,uw,vh){draw(x,y,0,w,h,u,v,uw,vh)}
foreign draw(a,b,c,d,e)
foreign draw(a,b,c,d,e,f,g,h,i)
foreign static defaultScaleFilter
foreign static defaultScaleFilter=(a)
foreign static defaultWrapMode
foreign static defaultWrapMode=(a)
foreign toString
}
class Quad{
foreign static beginBatch()
foreign static endBatch()
foreign static draw(a,b,c,d,e)
foreign static draw(a,b,c,d,e,f,g,h,i)
static drawLine(x1,y1,x2,y2,w,c){
var x=x2-x1
var y=y2-y1
var n=(x*x+y*y).sqrt
if(n==0){
draw(x1-w/2,y1-w/2,w,w,c)
}else{
x=(x/n)*w*0.5
y=(y/n)*w*0.5
draw(x1+y-x,y1-x-y,x1-y-x,y1+x-y,x2+y+x,y2-x+y,x2-y+x,y2+x+y,c)
}
}
}
class AudioControls{
removeEffect(i){
setEffect_(i,0,0,0,0,0)
}
removeEffects(){
for(i in 0...4){
removeEffect(i)
}
}
effect(i){
var t=getEffect_(i)
if(t==1)return FilterEffect.new(this,i)
if(t==2)return EchoEffect.new(this,i)
return null
}
addLowpass(i,f){addLowpass(i,f,1)}
addLowpass(i,f,r){addFilter_(i,0,f,r)}
addHighpass(i,f){addHighpass(i,f,1)}
addHighpass(i,f,r){addFilter_(i,1,f,r)}
addBandpass(i,f){addBandpass(i,f,1)}
addBandpass(i,f,r){addFilter_(i,2,f,r)}
addFilter_(i,t,f,r){
setEffect_(i,1,t,f,r,0)
return FilterEffect.new(this,i)
}
addEcho(i,d,k){addEcho(i,d,k,k)}
addEcho(i,d,k,m){
setEffect_(i,2,d,k,m,0)
return EchoEffect.new(this,i)
}
addReverb(i){
setEffect_(i,3,1,0,0,0)
return ReverbEffect.new(this,i)
}
}
class FilterEffect{
construct new(o,i){
_o=o
_i=i
}
index{_i}
remove(){_o.removeEffect(_i)}
type{
var v=_o.getParam_(_i,1,0)
return v==0 ? "low" :(v==1 ? "high" :(v==2 ? "band" : null))
}
type=(v){
v=v=="low" ? 0 :(v=="high" ? 1 :(v=="band" ? 2 :-1))
_o.setParam_(_i,1,0,v,0)
}
frequency{_o.getParam_(_i,1,1)}
frequency=(v){fadeFrequency(v,0)}
fadeFrequency(v,t){_o.setParam_(_i,1,1,v,t)}
resonance{_o.getParam_(_i,1,2)}
resonance=(v){fadeResonance(v,0)}
fadeResonance(v,t){_o.setParam_(_i,1,2,v,t)}
}
class EchoEffect{
construct new(o,i){
_o=o
_i=i
}
index{_i}
remove(){_o.removeEffect(_i)}
volume{_o.getParam_(_i,2,2)}
volume=(v){fadeVolume(v,0)}
fadeVolume(v,t){_o.setParam_(_i,2,2,v,t)}
delay{_o.getParam_(_i,2,0)}
delay=(v){_o.setParam_(_i,2,0,v,0)}
decay{_o.getParam_(_i,2,1)}
decay=(v){_o.setParam_(_i,2,1,v,0)}
}
class ReverbEffect{
construct new(o,i){
_o=o
_i=i
}
index{_i}
remove(){_o.removeEffect(_i)}
volume{_o.getParam_(_i,3,0)}
volume=(v){fadeVolume(v,0)}
fadeVolume(v,t){_o.setParam_(_i,3,0,v,t)}
}
foreign class AudioBus is AudioControls{
construct new(){}
foreign volume
volume=(v){fadeVolume(v,0)}
foreign fadeVolume(a,b)
foreign getEffect_(a)
foreign setEffect_(a,b,c,d,e,f)
foreign getParam_(a,b,c)
foreign setParam_(a,b,c,d,e)
}
foreign class Audio{
static load(p){load_(p,Promise.new()).await}
foreign static load_(a,b)
foreign duration
foreign voice()
foreign voice(a)
play(){voice().play()}
play(bus){voice(bus).play()}
playAtVolume(a){
var v=voice()
v.volume=a
return v.play()
}
playAtVolume(b,a){
var v=voice(b)
v.volume=a
return v.play()
}
foreign static volume
static volume=(v){fadeVolume(v,0)}
foreign static fadeVolume(a,b)
}
foreign class Voice is AudioControls{
foreign play()
foreign pause()
foreign stop()
foreign isPaused
isPaused=(p){p ? pause(): play()}
togglePaused(){isPaused=!isPaused}
foreign volume
volume=(v){fadeVolume(v,0)}
foreign fadeVolume(a,b)
foreign rate
rate=(v){fadeRate(v,0)}
foreign fadeRate(a,b)
pitch{12*rate.log2}
pitch=(v){fadePitch(v,0)}
fadePitch(v,t){fadeRate((2).pow(v/12),t)}
foreign loop
foreign loop=(a)
foreign loopStart
foreign loopStart=(a)
foreign getEffect_(a)
foreign setEffect_(a,b,c,d,e,f)
foreign getParam_(a,b,c)
foreign setParam_(a,b,c,d,e)
}
class JSON{
static load(p){fromString(Asset.loadString(p))}
static fromString(s){
if(s==null)return s
var p=JSON.new_(s)
p.z()
return p.m ? p.value(): null
}
construct new_(s){
_t=s
_b=s.bytes
_i=0
_n=_b.count
}
m{_i<_n}
e(){
if(_i>=_n)Fiber.abort("unexpected end of JSON")
}
e(a){
if(_i+a>=_n)Fiber.abort("unexpected end of JSON")
}
h(){
z()
e()
}
z(){
while(m){
var c=_b[_i]
if(c==32||c==9||c==10||c==13){
_i=_i+1
}else if(c==47&&_i+1<_n&&_b[_i+1]){
_i=_i+2
while(m){
c=_b[_i]
_i=_i+1
if(c==10||c==13){
break
}
}
}else{
break
}
}
}
y(m){
Fiber.abort("%(m) '%(_t[(_i)...(_i + 9).min(_n)].replace("\n", " "))..'")
}
value(){
var c=_b[_i]
if(c==34)return b()
if(c==91){
_i=_i+1
h()
var l=[]
if(_b[_i]==93){
_i=_i+1
}else{
while(true){
l.add(value())
h()
var a
if(_b[_i]==44){
a=true
_i=_i+1
h()
}
if(_b[_i]==93){
_i=_i+1
break
}
if(!a)y("expect ',' or ']' after array value")
}
if(l.count==2){
var k=l[0]
if(k is String&&k.count>1&&k[0]=="»"){
k=k[1..-1]
var v=l[1]
if(k=="Num"){
if(v is String)return Num.fromString(v)
}else if(k=="Map"){
if(v is List){
var m={}
for(i in 1...v.count..2){
m[v[i-1]]=v[i]
}
return m
}
}else{
var f=__m[k]
if(f)return f.fromJSON(l[1])
}
}
}
}
return l
}
if(c==123){
_i=_i+1
h()
var l={}
if(_b[_i]==125){
_i=_i+1
}else{
while(true){
if(_b[_i]!=34)y("expected string for object key")
var k=b()
h()
if(_b[_i]!=58)y("expected ':' after object key")
_i=_i+1
h()
l[k]=value()
h()
var a
if(_b[_i]==44){
a=true
_i=_i+1
h()
}
if(_b[_i]==125){
_i=_i+1
break
}
if(!a)y("expect ',' or '}' after object value")
}
}
return l
}
if((c>=48&&c<=57)||c==45){
var s=1
if(c==45){
s=-1
_i=_i+1
e()
c=_b[_i]
}
var d=0
_i=_i+1
if(c==48){
}else if(c>48&&c<=57){
d=c-48
while(_i<_n){
c=_b[_i]
if(c>=48&&c<=57){
d=d*10+c-48
_i=_i+1
}else{
break
}
}
}else{
y("invalid symbol in digit")
}
if(_i<_n&&_b[_i]==46){
_i=_i+1
e()
c=_b[_i]
if(c>=48&&c<=57){
var a=c-48
var b=10
_i=_i+1
while(_i<_n){
c=_b[_i]
if(c>=48&&c<=57){
a=a*10+c-48
b=b*10
_i=_i+1
}else{
break
}
}
d=d+a/b
}else{
y("expected digit after '.' in number")
}
}
if(_i<_n&&(_b[_i]==69||_b[_i]==101)){
_i=_i+1
e()
var p=true
c=_b[_i]
if(c==43||c==45){
if(c==45)p=false
_i=_i+1
e()
}
if(c>=48&&c<=57){
var e=c-48
_i=_i+1
while(_i<_n){
c=_b[_i]
if(c>=48&&c<=57){
e=e*10+c-48
_i=_i+1
}else{
break
}
}
e=10.pow(e)
d=p ? d*e : d/e
}else{
y("expected digit after exponent in number")
}
}
return d*s
}
if(n("null"))return null
if(n("true"))return true
if(n("false"))return false
y("invalid value")
}
n(s){
s=s.bytes
if(_i+s.count>_n)return false
var i=_i
for(c in s){
if(c!=_b[i])return false
i=i+1
}
_i=_i+s.count
return true
}
b(){
_i=_i+1
var s=_s ? _s.clear():(_s=StringBuilder.new())
while(true){
e()
var c=_b[_i]
_i=_i+1
if(c==34)break
if(c==92){
e()
c=_b[_i]
_i=_i+1
if(c==98){
c=8
}else if(c==102){
c=12
}else if(c==110){
c=10
}else if(c==114){
c=13
}else if(c==116){
c=9
}else if(c==117){
e(4)
var r=_t[_i..(_i+3)]
c=Num.fromString("0x"+r)
if(!c)y("invalid hex %(r)")
s.add(String.fromCodePoint(c))
_i=_i+4
continue
}
}
s.addByte(c)
}
return s.toString
}
static toString(x){
var s=StringBuilder.new()
toString_(s,x)
return s.toString
}
static toString_(sb,x){
if(x is Num){
if(x.isInfinity){
sb.add("[\"»Num\",\"infinity\"]")
}else if(x.isNan){
sb.add("[\"»Num\",\"nan\"]")
}else{
sb.add(x)
}
}else if(x is Null||x is Bool){
sb.add(x)
}else if(x is String){
addString_(sb,x)
}else if(x is List){
addList_(sb,x)
}else if(x is Map){
var first=true
if(x.keys.all{|k|k is String}){
sb.addByte(123)
for(e in x){
if(first){
first=false
}else{
sb.addByte(44)
}
addString_(sb,e.key)
sb.addByte(58)
toString_(sb,e.value)
}
sb.addByte(125)
}else{
sb.add("[\"»Map\",[")
for(e in x){
if(first){
first=false
}else{
sb.addByte(44)
}
toString_(sb,e.key)
sb.addByte(44)
toString_(sb,e.value)
}
sb.add("]]")
}
}else if(__m.containsKey(x.type)){
sb.add("[\"»")
sb.add(x.type)
sb.add("\",")
toString_(sb,x.toJSON)
sb.addByte(93)
}else if(x is Sequence){
addList_(sb,x.toList)
}else{
addString_(sb,x)
}
}
static addString_(sb,s){
s=s.toString
sb.addByte(34)
for(b in s.bytes){
if(b==8){
sb.add("\\b")
}else if(b==9){
sb.add("\\t")
}else if(b==10){
sb.add("\\n")
}else if(b==12){
sb.add("\\f")
}else if(b==13){
sb.add("\\r")
}else if(b<32){
sb.add("\\u00")
if(b<16){
sb.addByte(48)
}else{
sb.addByte(49)
b=b&15
}
sb.addByte(b<=9 ? 48+b : 87+b)
}else{
if(b==34||b==92){
sb.addByte(92)
}
sb.addByte(b)
}
}
sb.addByte(34)
}
static addList_(sb,x){
sb.addByte(91)
var first=true
for(y in x){
if(first){
first=false
}else{
sb.addByte(44)
}
toString_(sb,y)
}
sb.addByte(93)
}
static register(cls){
__m[cls]=true
__m[cls.name]=cls
}
static init_(){
__m={}
}
}
JSON.init_()
JSON.register(Buffer)
JSON.register(Vec)
JSON.register(Transform)
class Storage{
static load(){load("storage")}
static save(a){save("storage",a)}
static delete(){delete("storage")}
static load(k){
var s=load_(k)
return s&&JSON.fromString(s)
}
static save(k,a){
save_(k,JSON.toString(a))
}
foreign static id
foreign static id=(a)
foreign static load_(a)
foreign static save_(a,b)
foreign static contains(a)
foreign static delete(a)
}
class JavaScript_{
static eval(s){eval(null,null,s)}
static eval(av,an,s){JSON.fromString(eval_(null,av&&JSON.toString(av),an&&JSON.toString(an),s))}
static evalAsync(s){evalAsync(null,null,s)}
static evalAsync(av,an,s){eval_(Promise.new(),av&&JSON.toString(av),an&&JSON.toString(an),s).then{|v|JSON.fromString(v)}}
foreign static eval_(a,b,c,d)
}
class Platform{
foreign static os
static name{"web"}
foreign static browser
static JavaScript{JavaScript_}
static Window{null}
}
