import{$ as e,A as t,B as n,D as r,F as i,G as a,I as o,J as s,K as c,L as l,N as ee,O as u,P as d,Q as te,R as f,S as ne,T as re,V as p,W as m,X as h,Y as g,Z as ie,_,a as v,b as y,et as b,f as x,h as S,i as C,j as ae,k as w,nt as T,o as E,q as D,r as oe,rt as O,t as k,tt as A,v as j,z as M}from"./index-Bz6PiVWr.js";import se from"./PricePage-DmjXAEnl.js";import"./Traceability-Btda6jW2.js";var N={class:`ai-analysis-panel`},P={class:`panel-header`},F={key:0,class:`analysis-status`},ce={key:1,class:`analysis-status success`},I={key:0,class:`panel-content`},L={class:`grade-section`},R={class:`grade-badge`},z={class:`grade-label`},B={class:`grade-details`},le={class:`detail-row`},ue={class:`detail-value`},V={class:`detail-row`},H={class:`detail-value price`},U={class:`detail-row`},de={class:`detail-value price`},fe={class:`detail-row`},pe={class:`detail-value`},me={class:`standards-section`},he={class:`metrics-section`},ge={class:`metric-label`},_e={class:`suggestion-section`},ve={class:`suggestions`},ye={class:`action-section`},be=k({__name:`AIAnalysisPanel`,props:{diseaseResult:{type:Object,default:()=>({})}},setup(s){let ee=s,te=e(!1),re=[{grade:`特级`,appearance:`饱满光滑，无斑点`,damage:`0%`,price:`¥7.0-8.0/kg`},{grade:`A级`,appearance:`饱满光滑，少量斑点`,damage:`<5%`,price:`¥6.0-7.0/kg`},{grade:`B级`,appearance:`较饱满，有少量斑点`,damage:`5-10%`,price:`¥5.0-6.0/kg`},{grade:`C级`,appearance:`不饱满，有明显斑点`,damage:`10-20%`,price:`¥4.0-5.0/kg`}],m=i(()=>{let e=ee.diseaseResult;if(!e||Object.keys(e).length===0)return{grade:`A级`,gradeLabel:`精品小黄姜`,gradeClass:`grade-a`,purchasePrice:6.5,retailPrice:8.8,gingerol:`2.35`,metrics:{appearance:{label:`外观评分`,value:`92`,percentage:92,color:`#67C23A`},density:{label:`密度`,value:`1.25`,percentage:88,color:`#409EFF`},moisture:{label:`水分含量`,value:`88%`,percentage:88,color:`#E6A23C`},fiber:{label:`纤维含量`,value:`低`,percentage:35,color:`#67C23A`},aroma:{label:`香气浓度`,value:`浓郁`,percentage:95,color:`#F56C6C`},quality:{label:`综合评分`,value:`91`,percentage:91,color:`#2d5a27`}},suggestions:[{icon:t,text:`建议使用冷链运输，保持温度2-5°C`},{icon:_,text:`已通过质量检测，符合出口标准`},{icon:u,text:`适合高端礼品包装，售价可提升20%`},{icon:y,text:`建议申请地理标志保护产品认证`}]};let n=e.disease===`健康`;return{grade:n?`A级`:`B级`,gradeLabel:n?`健康优质`:`需注意病虫害`,gradeClass:n?`grade-a`:`grade-b`,purchasePrice:n?6.5:5.2,retailPrice:n?8.8:7,gingerol:n?`2.35`:`1.85`,metrics:{appearance:{label:`外观评分`,value:n?`92`:`75`,percentage:n?92:75,color:n?`#67C23A`:`#E6A23C`},density:{label:`密度`,value:n?`1.25`:`1.15`,percentage:n?88:78,color:`#409EFF`},moisture:{label:`水分含量`,value:n?`88%`:`85%`,percentage:n?88:85,color:`#E6A23C`},fiber:{label:`纤维含量`,value:n?`低`:`中`,percentage:n?35:55,color:n?`#67C23A`:`#E6A23C`},aroma:{label:`香气浓度`,value:n?`浓郁`:`正常`,percentage:n?95:75,color:`#F56C6C`},quality:{label:`综合评分`,value:n?`91`:`78`,percentage:n?91:78,color:`#2d5a27`}},suggestions:n?[{icon:t,text:`建议使用冷链运输，保持温度2-5°C`},{icon:_,text:`已通过质量检测，符合出口标准`},{icon:u,text:`适合高端礼品包装，售价可提升20%`},{icon:y,text:`建议申请地理标志保护产品认证`}]:[{icon:_,text:`检测到病虫害迹象，建议及时防治`},{icon:t,text:`分开存放，避免交叉感染`},{icon:u,text:`可作为工业加工原料，售价略低`},{icon:y,text:`建议咨询农技人员制定防治方案`}]}}),ie=()=>{v.success(`报告链接已复制到剪贴板`)},C=()=>{v.success(`报告导出中...`)},ae=()=>{v.success(`溯源码生成成功！`)};return(e,t)=>{let i=D(`el-icon`),s=D(`el-table-column`),ee=D(`el-table`),u=D(`el-progress`),_=D(`el-card`),v=D(`el-col`),y=D(`el-row`),w=D(`el-button`);return a(),M(`div`,N,[o(`div`,P,[t[2]||=o(`h3`,null,`🤖 AI 智能分选分析报告`,-1),te.value?(a(),M(`div`,F,[p(i,{class:`rotating`},{default:h(()=>[p(b(ne))]),_:1}),t[0]||=o(`span`,null,`分析中...`,-1)])):(a(),M(`div`,ce,[p(i,null,{default:h(()=>[p(b(x))]),_:1}),t[1]||=o(`span`,null,`分析完成`,-1)]))]),m.value?(a(),M(`div`,I,[o(`div`,L,[o(`div`,{class:A([`grade-card`,m.value.gradeClass])},[o(`div`,R,O(m.value.grade),1),o(`div`,z,O(m.value.gradeLabel),1)],2),o(`div`,B,[o(`div`,le,[t[3]||=o(`span`,{class:`detail-key`},`品级判定:`,-1),o(`span`,ue,O(m.value.grade),1)]),o(`div`,V,[t[4]||=o(`span`,{class:`detail-key`},`建议收购价:`,-1),o(`span`,H,`¥`+O(m.value.purchasePrice)+`/kg`,1)]),o(`div`,U,[t[5]||=o(`span`,{class:`detail-key`},`建议零售价:`,-1),o(`span`,de,`¥`+O(m.value.retailPrice)+`/kg`,1)]),o(`div`,fe,[t[6]||=o(`span`,{class:`detail-key`},`姜辣素估算:`,-1),o(`span`,pe,O(m.value.gingerol)+`%`,1)])])]),o(`div`,me,[t[7]||=o(`h4`,null,`📏 分级判定标准`,-1),p(ee,{data:re,size:`small`,border:``},{default:h(()=>[p(s,{prop:`grade`,label:`品级`,width:`80`}),p(s,{prop:`appearance`,label:`外观标准`}),p(s,{prop:`damage`,label:`损伤度`}),p(s,{prop:`price`,label:`参考价格`})]),_:1})]),o(`div`,he,[t[8]||=o(`h4`,null,`📊 质量检测指标`,-1),p(y,{gutter:16},{default:h(()=>[(a(!0),M(d,null,c(m.value.metrics,(e,t)=>(a(),l(v,{span:8,key:t},{default:h(()=>[p(_,{shadow:`hover`,class:`metric-card`},{default:h(()=>[o(`div`,{class:`metric-value`,style:T({color:e.color})},O(e.value),5),o(`div`,ge,O(e.label),1),p(u,{percentage:e.percentage,color:e.color,"show-text":!1,"stroke-width":6},null,8,[`percentage`,`color`])]),_:2},1024)]),_:2},1024))),128))]),_:1})]),o(`div`,_e,[t[9]||=o(`h4`,null,`💡 AI 建议操作`,-1),o(`div`,ve,[(a(!0),M(d,null,c(m.value.suggestions,(e,t)=>(a(),M(`div`,{key:t,class:`suggestion-item`},[p(i,{size:20},{default:h(()=>[(a(),l(g(e.icon)))]),_:2},1024),o(`span`,null,O(e.text),1)]))),128))])]),o(`div`,ye,[p(w,{type:`primary`,onClick:ie},{default:h(()=>[p(i,null,{default:h(()=>[p(b(r))]),_:1}),t[10]||=n(` 分享报告 `,-1)]),_:1}),p(w,{onClick:C},{default:h(()=>[p(i,null,{default:h(()=>[p(b(j))]),_:1}),t[11]||=n(` 导出 PDF `,-1)]),_:1}),p(w,{type:`success`,onClick:ae},{default:h(()=>[p(i,null,{default:h(()=>[p(b(S))]),_:1}),t[12]||=n(` 生成溯源码 `,-1)]),_:1})])])):f(``,!0)])}}},[[`__scopeId`,`data-v-7afb7585`]]),xe={class:`farmer-container`},Se={class:`header-left`},Ce={class:`user-info`},we={class:`header-right`},Te={key:0,class:`section`},Ee={class:`quick-samples`},De={class:`samples-list`},Oe=[`onClick`],ke={class:`thumb-img`},Ae=[`src`,`alt`],je={class:`thumb-name`},Me={class:`mode-switch-bar`},Ne=[`onClick`],Pe={key:0,class:`detecting-skeleton`},Fe={class:`skeleton-title`},Ie={class:`ai-detect-layout`},Le={class:`left-panel`},Re={key:0,class:`upload-placeholder`},ze={key:1,class:`upload-preview sample-preview-box`},Be=[`src`,`alt`],Ve={class:`sample-preview-label`},He=[`src`],Ue={class:`preview-mask`},We={class:`right-panel`},Ge={key:0,class:`result-card`},Ke={class:`price-highlight`},qe={class:`gingerol-highlight`},Je={class:`suggestion-box`},Ye={class:`sop-list`},Xe={class:`sop-index`},Ze={class:`sop-text`},Qe={key:1,class:`result-placeholder`},$e={key:1,class:`analysis-card`},et={key:1,class:`section`},tt={key:0,class:`tech-categories-grid`},nt=[`onClick`],rt={class:`category-icon`},it={class:`category-name`},at={class:`category-count`},ot={key:1,class:`tech-categories-grid`},st={class:`breadcrumb-bar`},ct={class:`breadcrumb-title`},lt=[`onClick`],ut={class:`category-icon sub-icon`},dt={class:`category-name`},ft={class:`category-count`},pt={key:2,class:`article-list`},mt={class:`breadcrumb-bar`},ht={class:`breadcrumb-title`},gt={key:0,class:`articles-grid`},_t=[`onClick`],vt={class:`article-icon`},yt={class:`article-info`},bt={class:`article-meta`},xt={key:3,class:`article-detail`},St={class:`breadcrumb-bar`},Ct={class:`breadcrumb-title`},wt={class:`article-body`},Tt=[`innerHTML`],Et={key:0,class:`dialog-article`},Dt={class:`dialog-meta`},Ot=[`innerHTML`],kt={key:2,class:`section`},At={class:`product-header`},jt={class:`mobile-card-list`},Mt={class:`mobile-card-header`},Nt={class:`mobile-card-title`},Pt={class:`mobile-card-body`},Ft={class:`mobile-card-row`},It={class:`mobile-card-row`},Lt={style:{color:`#67c23a`,"font-weight":`bold`}},Rt={class:`mobile-card-row`},zt={class:`mobile-card-row`},Bt={class:`mobile-card-footer`},Vt={class:`stats-row`},Ht={class:`stat-info`},Ut={class:`stat-value`},Wt={class:`stat-info`},Gt={class:`stat-value`},Kt={class:`stat-info`},qt={class:`stat-value`},Jt={key:3,class:`section`},Yt={class:`mobile-tab-bar`},Xt=[`src`],W=``,Zt=k({__name:`FarmerPage`,setup(t){let r=oe(),u=e(`ai`),g=e({}),_=e(null),y=e(``),x=e(``),S=e(!1),T=e(!1),k=e(null),j=[{id:1,name:`正常姜`,image:`/ginger-healthy.jpg`},{id:2,name:`姜瘟病`,image:`/ginger-blight-42.jpeg`},{id:3,name:`叶枯病`,image:`/ginger-leaf-blight-2-3.jpg`}],N={1:{disease:`健康`,confidence:`0.9856`,severity:`无`,gradeLabel:`特级`,gradeType:`success`,purchasePrice:`8.5`,gingerolRange:`2.8% - 3.2%`,sopSteps:[`继续保持良好的田间管理，避免积水`,`定期巡检，每周观察1次叶片状态`,`采收后及时晾晒，储存于通风干燥处`]},2:{disease:`姜瘟病`,confidence:`0.9723`,severity:`重度`,gradeLabel:`等外`,gradeType:`danger`,purchasePrice:`3.2`,gingerolRange:`0.8% - 1.1%`,sopSteps:[`立即拔除病株并集中销毁，防止扩散`,`对病穴及周围1米土壤撒施石灰消毒`,`全田喷施72%农用硫酸链霉素4000倍液，每7天一次，连续3次`,`收获后禁止留种，与非姜科作物轮作3年以上`]},3:{disease:`叶枯病`,confidence:`0.9418`,severity:`中度`,gradeLabel:`二级`,gradeType:`warning`,purchasePrice:`5.5`,gingerolRange:`1.5% - 1.8%`,sopSteps:[`剪除发病叶片并带出田外集中处理`,`喷施10%苯醚甲环唑1500倍液，每7-10天一次`,`加强通风透光，合理疏密种植`,`雨后及时排水，降低田间湿度`]}},P=i(()=>k.value?j.find(e=>e.id===k.value):null),F=i(()=>{if(!_.value?.confidence)return 0;let e=parseFloat(_.value.confidence);return isNaN(e)?0:+(e*100).toFixed(2)}),ce=i(()=>_.value?.confidence?F.value+`%`:`0%`),I=e=>{T.value||(k.value=e.id,T.value=!0,_.value=null,x.value=``,setTimeout(()=>{T.value=!1,_.value=N[e.id],v.success(`AI 识别完成！`)},0))},L=e([]),R=e(!1),z=e(!1),B=te({id:null,origin:``,weight:0,price:0,harvestDate:``,grade:`B`,description:``,imageUrl:``}),le=i(()=>L.value.filter(e=>e.status===`available`).length),ue=i(()=>L.value.reduce((e,t)=>e+t.price*t.weight,0).toFixed(2)),V=e([{key:`seedling`,name:`选种育苗`,icon:`🌱`,children:[{key:`seed-selection`,name:`姜种挑选`},{key:`seed-treatment`,name:`姜种处理`},{key:`accelerating`,name:`催芽技术`}]},{key:`field`,name:`田间管理`,icon:`🌾`,children:[{key:`density`,name:`种植密度`},{key:`weeding`,name:`中耕除草`},{key:`water-management`,name:`水分管理`},{key:`shading`,name:`遮阴管理`}]},{key:`fertilizer`,name:`施肥技术`,icon:`🧪`,children:[{key:`base-fertilizer`,name:`基肥施用`},{key:`topdressing`,name:`追肥技巧`},{key:`foliar`,name:`叶面施肥`}]},{key:`disease`,name:`病虫害防治`,icon:`🐛`,children:[{key:`bacterial-wilt`,name:`姜瘟病`},{key:`anthracnose`,name:`炭疽病`},{key:`leaf-blight`,name:`叶枯病`},{key:`borer`,name:`姜螟`},{key:`aphid`,name:`蚜虫`}]},{key:`harvest`,name:`收获储存`,icon:`📦`,children:[{key:`harvest-time`,name:`收获时机`},{key:`storage`,name:`储存方法`}]},{key:`market`,name:`市场行情`,icon:`📊`,children:[{key:`price-trend`,name:`价格趋势`},{key:`sales-tips`,name:`销售技巧`}]}]),H=e(null),U=e(null),de=i(()=>{let e=V.value.find(e=>e.key===H.value);return e?e.icon:``}),fe=i(()=>{if(!U.value)return``;for(let e of V.value){let t=e.children?.find(e=>e.key===U.value);if(t)return t.name}return``}),pe=i(()=>V.value.find(e=>e.key===H.value)?.children||[]),me=e=>({"seed-selection":`🫘`,"seed-treatment":`🧴`,accelerating:`🌱`,density:`📏`,weeding:`✂️`,"water-management":`💧`,shading:`☂️`,"base-fertilizer":`🌾`,"top-fertilizer":`💪`,"foliar-spray":`🧪`,"bacterial-wilt":`🦠`,anthracnose:`🍂`,"leaf-blight":`🍁`,borer:`🐛`,aphid:`🐜`,"harvest-time":`⏰`,storage:`📦`,"price-trend":`📈`,"sales-skills":`💼`})[e]||`📄`,he=e=>G.value.filter(t=>t.category===e).length,ge=e=>G.value.filter(t=>t.subCategory===e).length,_e=e=>{H.value=e,U.value=null,K.value=null},ve=e=>{U.value=e,K.value=null},ye=()=>{H.value=null,U.value=null,K.value=null},Zt=()=>{U.value=null,K.value=null},Qt=i(()=>{let e=V.value.find(e=>e.key===H.value);return e?e.name:``}),$t=i(()=>{let e=G.value;return H.value&&(e=e.filter(e=>e.category===H.value)),U.value&&(e=e.filter(e=>e.subCategory===U.value)),e}),G=e([{id:1,title:`生姜种植技巧`,icon:`🌱`,description:`从选种到收获的完整种植指南`,category:`seedling`,subCategory:`seed-selection`,views:1256,rating:`4.8`,publishTime:`2026-07-15`,content:`
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #2d5a27; margin-bottom: 20px;">🌱 生姜种植技巧</h2>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">一、选种与处理</h3>
        <p>选择饱满、无病虫害的姜块作为种姜，单块重量以50-100克为宜。播种前将种姜晾晒2-3天，提高发芽率。可使用多菌灵溶液浸种消毒，预防病害。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">二、整地与施肥</h3>
        <p>选择土层深厚、疏松肥沃、排水良好的沙质壤土。播种前深翻土地30厘米以上，施足基肥，每亩施腐熟有机肥2000-3000公斤、复合肥50公斤。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">三、播种与密度</h3>
        <p>适宜播种期为清明至谷雨之间。采用穴播或条播，行距60-70厘米，株距20-25厘米，每亩播种量150-200公斤。播种后覆土5-10厘米。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">四、田间管理</h3>
        <p><strong>中耕除草：</strong>苗高15-20厘米时进行第一次中耕，以后每20-30天进行一次。</p>
        <p><strong>浇水：</strong>保持土壤湿润，特别是夏季高温季节要及时浇水，但避免积水。</p>
        <p><strong>培土：</strong>生长中后期分次培土，防止姜块外露变绿。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">五、收获与储存</h3>
        <p>霜降前后收获最为适宜。收获后晾干表面水分，可窖藏或堆放，保持温度10-15℃，湿度80-90%。</p>
      </div>
    `},{id:2,title:`姜种挑选标准`,icon:`🌰`,description:`如何挑选优质姜种`,category:`seedling`,subCategory:`seed-selection`,views:892,rating:`4.7`,publishTime:`2026-07-20`,content:`
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #2d5a27; margin-bottom: 20px;">🌰 姜种挑选标准</h2>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">一、外观要求</h3>
        <p>选择姜块饱满、表皮光滑、色泽金黄的健康姜种。避免选择表皮皱缩、变色或有机械损伤的姜块。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">二、大小要求</h3>
        <p>单块姜种重量以50-100克为宜。过小的姜种养分不足，过大则浪费种姜。每块姜种上应有2-3个饱满的芽眼。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">三、健康检查</h3>
        <p>仔细检查姜种表面，确保无病虫害斑点、无腐烂迹象。切开姜种，内部应为淡黄色，无褐变或异味。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">四、品种选择</h3>
        <p>根据当地气候、土壤条件和市场需求选择适宜品种。推荐选用脱毒良种，产量高、品质好、抗病性强。</p>
      </div>
    `},{id:3,title:`催芽技术要点`,icon:`💡`,description:`提高发芽率的关键技术`,category:`seedling`,subCategory:`accelerating`,views:678,rating:`4.6`,publishTime:`2026-06-28`,content:`
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #2d5a27; margin-bottom: 20px;">💡 催芽技术要点</h2>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">一、晒种处理</h3>
        <p>播种前将姜种摊放在阳光下晾晒2-3天，每天翻动数次。晒种可促进姜种内部营养物质转化，提高发芽率。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">二、浸种消毒</h3>
        <p>使用50%多菌灵可湿性粉剂500倍液浸种30分钟，或用100倍石灰水浸种1小时。浸种后捞出沥干，可有效预防病害。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">三、温床催芽</h3>
        <p>将处理好的姜种放在温床或温室中，保持温度20-25℃，湿度80-90%。可使用湿沙或湿稻草覆盖，大约20-30天即可出芽。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">四、芽期管理</h3>
        <p>姜芽出土后要及时揭去覆盖物，增加光照。保持适宜温度，避免低温冻害。待姜芽长至1-2厘米时即可播种。</p>
      </div>
    `},{id:4,title:`施肥管理`,icon:`🧪`,description:`科学施肥提高产量和品质`,category:`fertilizer`,subCategory:`base-fertilizer`,views:1023,rating:`4.8`,publishTime:`2026-07-05`,content:`
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #2d5a27; margin-bottom: 20px;">🧪 生姜施肥管理</h2>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">一、基肥</h3>
        <p>播种前每亩施腐熟有机肥2000-3000公斤，复合肥50公斤，硫酸锌1公斤。将肥料均匀撒施后翻入土中。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">二、追肥</h3>
        <p><strong>苗肥：</strong>苗高10-15厘米时，每亩追施尿素10公斤，促进幼苗生长。</p>
        <p><strong>壮苗肥：</strong>苗高30厘米左右时，每亩追施复合肥20公斤、尿素10公斤。</p>
        <p><strong>膨大肥：</strong>8-9月姜块膨大期，每亩追施复合肥30公斤、硫酸钾15公斤。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">三、叶面施肥</h3>
        <p>生长中后期可喷施0.2%磷酸二氢钾、0.1%硫酸锌等叶面肥，每隔7-10天一次，连续2-3次。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">四、施肥注意事项</h3>
        <ul>
          <li>避免偏施氮肥，注意氮磷钾平衡</li>
          <li>施肥时避免直接接触姜块</li>
          <li>雨后或灌溉后施肥效果更佳</li>
          <li>根据土壤肥力调整施肥量</li>
        </ul>
      </div>
    `},{id:5,title:`浇水管理`,icon:`💧`,description:`合理灌溉保证生姜生长`,category:`field`,subCategory:`water-management`,views:856,rating:`4.7`,publishTime:`2026-07-10`,content:`
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #2d5a27; margin-bottom: 20px;">💧 生姜浇水管理</h2>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">一、浇水原则</h3>
        <p>生姜喜湿润但不耐涝。全生长期要求土壤湿润，田间持水量保持在70-80%。避免积水，防止烂根。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">二、各生育期浇水</h3>
        <p><strong>播种出苗期：</strong>保持土壤湿润，促进发芽出苗。</p>
        <p><strong>幼苗期：</strong>适当控水，促进根系发育。</p>
        <p><strong>生长旺盛期：</strong>加大浇水量，特别是夏季高温季节，每3-5天浇一次水。</p>
        <p><strong>姜块膨大期：</strong>保持土壤湿润，促进姜块膨大。</p>
        <p><strong>收获前：</strong>适当控水，有利于储存。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">三、浇水方式</h3>
        <p><strong>沟灌：</strong>适用于大面积种植，灌水量大。</p>
        <p><strong>喷灌：</strong>节约用水，适合丘陵地区。</p>
        <p><strong>滴灌：</strong>节水高效，能精准供水。</p>
      </div>
    `},{id:6,title:`姜瘟病防治`,icon:`🦠`,description:`姜瘟病的识别与综合防治`,category:`disease`,subCategory:`bacterial-wilt`,views:2156,rating:`4.9`,publishTime:`2026-08-01`,content:`
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #c0392b; margin-bottom: 20px;">🦠 姜瘟病防治</h2>
        
        <h3 style="color: #c0392b; margin-top: 20px; margin-bottom: 10px;">一、病害症状</h3>
        <p>姜瘟病又称姜腐败病，是生姜生产中最严重的病害之一。主要症状：</p>
        <ul>
          <li>叶片从下往上变黄萎蔫</li>
          <li>茎基部变软、水渍状</li>
          <li>内部组织变褐发黑</li>
          <li>有恶臭气味溢出</li>
          <li>姜块腐烂、水渍状</li>
        </ul>
        
        <h3 style="color: #c0392b; margin-top: 20px; margin-bottom: 10px;">二、发病规律</h3>
        <p>病菌可在土壤中存活2年以上，通过种姜、土壤、水流、农具等传播。高温高湿条件下容易暴发流行。</p>
        
        <h3 style="color: #27ae60; margin-top: 20px; margin-bottom: 10px;">三、防治方法</h3>
        <p><strong>农业防治：</strong></p>
        <ul>
          <li>选用无病种姜，播种前消毒</li>
          <li>合理轮作，与非姜科作物轮作3年以上</li>
          <li>增施有机肥，提高植株抗病力</li>
          <li>雨后及时排水，避免积水</li>
        </ul>
        <p><strong>物理防治：</strong></p>
        <ul>
          <li>发现病株及时拔除销毁</li>
          <li>用石灰消毒病穴</li>
          <li>农具使用后及时消毒</li>
        </ul>
        <p><strong>化学防治：</strong></p>
        <ul>
          <li>喷施72%农用硫酸链霉素可溶性粉剂4000倍液</li>
          <li>或喷施20%噻菌铜悬浮剂500倍液</li>
          <li>每隔7-10天喷一次，连续2-3次</li>
        </ul>
      </div>
    `},{id:7,title:`炭疽病防治`,icon:`🍂`,description:`炭疽病的识别与防治方法`,category:`disease`,subCategory:`anthracnose`,views:1567,rating:`4.8`,publishTime:`2026-07-25`,content:`
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #e67e22; margin-bottom: 20px;">🍂 炭疽病防治</h2>
        
        <h3 style="color: #e67e22; margin-top: 20px; margin-bottom: 10px;">一、病害症状</h3>
        <p>炭疽病主要危害叶片，也可侵害茎秆和姜块。叶片发病初期出现圆形或近圆形病斑，后期病斑扩大，多个病斑融合致叶片枯死。</p>
        
        <h3 style="color: #e67e22; margin-top: 20px; margin-bottom: 10px;">二、发病规律</h3>
        <p>病菌以分生孢子盘在病残体上越冬，次年产生分生孢子进行初侵染。高温多雨、通风不良时发病严重。</p>
        
        <h3 style="color: #27ae60; margin-top: 20px; margin-bottom: 10px;">三、防治方法</h3>
        <ul>
          <li>清除病残体，减少菌源</li>
          <li>合理密植，保持通风透光</li>
          <li>发病初期喷施25%咪鲜胺乳油1000倍液</li>
          <li>或喷施10%苯醚甲环唑水分散粒剂1500倍液</li>
          <li>每隔7-10天喷一次，连续2-3次</li>
        </ul>
      </div>
    `},{id:8,title:`姜螟防治`,icon:`🐛`,description:`姜螟虫的识别与防治`,category:`disease`,subCategory:`borer`,views:1324,rating:`4.7`,publishTime:`2026-07-18`,content:`
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #f39c12; margin-bottom: 20px;">🐛 姜螟防治</h2>
        
        <h3 style="color: #f39c12; margin-top: 20px; margin-bottom: 10px;">一、虫害症状</h3>
        <p>姜螟又称玉米螟，是生姜主要害虫之一。幼虫钻蛀茎秆，造成枯心或折断，排出粪便，影响生姜生长。</p>
        
        <h3 style="color: #f39c12; margin-top: 20px; margin-bottom: 10px;">二、防治方法</h3>
        <p><strong>物理防治：</strong></p>
        <ul>
          <li>灯光诱杀成虫（使用黑光灯或频振式杀虫灯）</li>
          <li>性诱剂诱杀</li>
        </ul>
        <p><strong>生物防治：</strong></p>
        <ul>
          <li>释放赤眼蜂等寄生性天敌</li>
          <li>使用Bt乳剂或苏云金杆菌可湿性粉剂</li>
        </ul>
        <p><strong>化学防治：</strong></p>
        <ul>
          <li>在低龄幼虫期喷施效果最佳</li>
          <li>使用50%辛硫磷乳油1000倍液</li>
          <li>或使用25%杀虫双水剂500倍液</li>
        </ul>
      </div>
    `},{id:9,title:`收获时机与方法`,icon:`✂️`,description:`确定最佳收获时间和正确方法`,category:`harvest`,subCategory:`harvest-time`,views:967,rating:`4.6`,publishTime:`2026-06-15`,content:`
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #2d5a27; margin-bottom: 20px;">✂️ 收获时机与方法</h2>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">一、收获时间</h3>
        <p>生姜的最佳收获时间因用途而异：</p>
        <ul>
          <li><strong>嫩姜：</strong>立秋至处暑之间收获，纤维少，辣味淡</li>
          <li><strong>老姜：</strong>霜降前后收获，纤维多，辣味浓，耐储存</li>
        </ul>
        <p>收获选择晴天，避免雨天收获导致姜块腐烂。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">二、收获方法</h3>
        <p>收获前3-5天停止浇水，便于土壤干燥。使用专用收获机械或人工挖掘，注意避免损伤姜块。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">三、采后处理</h3>
        <p>收获后及时清除泥土和杂质，保留2-3厘米的茎秆。将姜块放在通风处晾干表面水分，注意避免阳光直射。</p>
      </div>
    `},{id:10,title:`储存方法`,icon:`📦`,description:`生姜的安全储存技术`,category:`harvest`,subCategory:`storage`,views:845,rating:`4.7`,publishTime:`2026-06-10`,content:`
      <div style="padding: 20px; line-height: 1.8;">
        <h2 style="color: #2d5a27; margin-bottom: 20px;">📦 生姜储存方法</h2>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">一、窖藏法</h3>
        <p>选择地势高燥、排水良好的地点挖窖。窖深2-3米，窖底铺一层湿沙。将姜块堆放窖中，保持温度10-15℃，湿度80-90%。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">二、堆放法</h3>
        <p>在室内通风处用湿沙或湿稻草覆盖姜块。堆高不超过1米，定期检查，发现腐烂姜块及时清除。</p>
        
        <h3 style="color: #4a7c59; margin-top: 20px; margin-bottom: 10px;">三、储存注意事项</h3>
        <ul>
          <li>储存前确保姜块充分晾干</li>
          <li>避免温度低于10℃，防止受冻</li>
          <li>避免温度高于20℃，防止发芽</li>
          <li>定期检查，及时处理问题姜块</li>
        </ul>
      </div>
    `}]),K=e(null),en=()=>{K.value=null};m(()=>{let e=localStorage.getItem(`user`);e?(g.value=JSON.parse(e),J()):r.push(`/`)});let tn=()=>{localStorage.removeItem(`user`),r.push(`/`)},nn=e=>{e.raw&&(k.value=null,x.value=URL.createObjectURL(e.raw))},rn=e=>{if(e.code===200){let t=e.data.prediction;_.value=an(t),y.value=e.data.imageUrl,v.success(`识别完成！`)}else v.error(e.message||`识别失败`)},an=e=>{let t=e.disease||`未知`,n=t===`健康`||t===`healthy`;if(e.confidence,n)return{...e,gradeLabel:`特级`,gradeType:`success`,purchasePrice:`8.5`,gingerolRange:`2.8% - 3.2%`,sopSteps:[`继续保持良好的田间管理，避免积水`,`定期巡检，每周观察1次叶片状态`,`采收后及时晾晒，储存于通风干燥处`]};let r=e.severity||`中度`,i=r===`重度`,a=i?`等外`:r===`中度`?`二级`:`一级`,o=i?`danger`:r===`中度`?`warning`:`success`,s=i?`3.2`:r===`中度`?`5.5`:`6.8`,c=i?`0.8% - 1.1%`:r===`中度`?`1.5% - 1.8%`:`2.0% - 2.4%`,l={姜瘟病:[`立即拔除病株并集中销毁，防止扩散`,`对病穴及周围1米土壤撒施石灰消毒`,`全田喷施72%农用硫酸链霉素4000倍液，每7天一次，连续3次`,`收获后禁止留种，与非姜科作物轮作3年以上`],叶枯病:[`剪除发病叶片并带出田外集中处理`,`喷施10%苯醚甲环唑1500倍液，每7-10天一次`,`加强通风透光，合理疏密种植`,`雨后及时排水，降低田间湿度`]};return{...e,gradeLabel:a,gradeType:o,purchasePrice:s,gingerolRange:c,sopSteps:l[t]||[`及时清除病株，防止病害扩散`,`喷施对应杀菌剂，每7-10天一次`,`加强田间管理，注意通风排水`,`收获后对土壤进行消毒处理`]}},on=()=>{x.value&&URL.revokeObjectURL(x.value),x.value=``,k.value=null,y.value=``,_.value=null},sn=()=>{on(),v.info(`已回到上传模式，请在左侧点击或拖拽上传图片`)},cn=()=>{v.error(`上传失败，请重试`)},ln=e=>{let t=e.type.startsWith(`image/`),n=e.size/1024/1024<15;return t||v.error(`只能上传图片文件！`),n||v.error(`图片大小不能超过 15MB！`),t&&n},un=e(!1),dn=e=>{K.value=e,un.value=!0,e.views=(parseInt(e.views)||0)+1},q=e(!1),J=async()=>{if(g.value.id){q.value=!0;try{let e=await(await fetch(`${W}/api/v1/product/farmer/${g.value.id}`)).json();e.code===200&&Array.isArray(e.data)?L.value=e.data.map(e=>({...e})):L.value=[]}catch{v.error(`加载货源失败，请稍后重试`),L.value=[]}finally{q.value=!1}}},fn=()=>{J(),v.success(`刷新成功`)},pn=()=>{R.value=!1,z.value=!1,Object.assign(B,{id:null,origin:``,weight:0,price:0,harvestDate:``,grade:`B`,description:``,imageUrl:``})},mn=async()=>{if(!B.origin){v.error(`请输入产地`);return}if(!B.weight||B.weight<=0){v.error(`请输入有效重量`);return}if(!B.price||B.price<=0){v.error(`请输入有效价格`);return}if(!B.harvestDate){v.error(`请选择采收日期`);return}try{let e=`${W}/api/v1/product`,t=z.value?`PUT`:`POST`,n=await(await fetch(e,{method:t,headers:{"Content-Type":`application/json`},body:JSON.stringify({id:B.id,farmerId:g.value.id,farmerName:g.value.realName||g.value.username,origin:B.origin,weight:B.weight,price:B.price,harvestDate:B.harvestDate,grade:B.grade,description:B.description,imageUrl:B.imageUrl})})).json();n.code===200?(v.success(z.value?`修改成功！`:`添加成功！`),pn(),J()):v.error(n.message||(z.value?`修改失败`:`添加失败`))}catch{v.error(z.value?`修改失败，请重试`:`添加失败，请重试`)}},hn=e=>{z.value=!0,R.value=!0,Object.assign(B,{id:e.id,origin:e.origin,weight:e.weight,price:e.price,harvestDate:e.harvestDate,grade:e.grade,description:e.description||``,imageUrl:e.imageUrl||``})},gn=e=>{C.confirm(`确定要删除编号为 ${e.id} 的货源吗？`,`确认删除`,{confirmButtonText:`确定`,cancelButtonText:`取消`,type:`warning`}).then(async()=>{try{let t=await(await fetch(`${W}/api/v1/product/${e.id}`,{method:`DELETE`})).json();t.code===200?(v.success(`删除成功！`),J()):v.error(t.message||`删除失败`)}catch{v.error(`删除失败，请重试`)}}).catch(()=>{v.info(`已取消删除`)})},_n=e(!1),Y=e=>{u.value!==e&&(u.value=e,_n.value=!1)},vn=e=>({A:`success`,B:`primary`,C:`info`})[e]||`info`,yn=e=>({A:`A级（优质）`,B:`B级（良好）`,C:`C级（普通）`})[e]||e,bn=e=>{e.code===200?(B.imageUrl=e.imageUrl,v.success(`图片上传成功`)):v.error(e.message||`图片上传失败`)};return(e,t)=>{let i=D(`el-button`),te=D(`el-header`),m=D(`el-menu-item`),v=D(`el-menu`),y=D(`el-aside`),C=D(`el-skeleton`),oe=D(`el-col`),N=D(`el-row`),G=D(`el-icon`),an=D(`el-upload`),J=D(`el-tag`),X=D(`el-descriptions-item`),xn=D(`el-progress`),Sn=D(`el-descriptions`),Z=D(`el-card`),Cn=D(`el-empty`),wn=D(`el-divider`),Tn=D(`el-dialog`),Q=D(`el-table-column`),En=D(`el-table`),Dn=D(`el-main`),On=D(`el-container`),kn=D(`el-input`),$=D(`el-form-item`),An=D(`el-input-number`),jn=D(`el-date-picker`),Mn=D(`el-option`),Nn=D(`el-select`),Pn=D(`el-form`),Fn=D(`el-image-viewer`),In=s(`loading`);return a(),M(`div`,xe,[p(On,null,{default:h(()=>[p(te,{class:`header`},{default:h(()=>[o(`div`,Se,[t[16]||=o(`h2`,null,`👨‍🌾 农户端`,-1),o(`span`,Ce,`欢迎，`+O(g.value.realName||g.value.username),1)]),o(`div`,we,[p(i,{type:`primary`,onClick:t[0]||=e=>b(r).push(`/price`)},{default:h(()=>[...t[17]||=[n(`📊 查看价格行情`,-1)]]),_:1}),p(i,{type:`danger`,onClick:tn},{default:h(()=>[...t[18]||=[n(`退出登录`,-1)]]),_:1})])]),_:1}),p(On,null,{default:h(()=>[p(y,{width:`200px`,class:`sidebar`},{default:h(()=>[p(v,{"default-active":u.value,onSelect:Y},{default:h(()=>[p(m,{index:`ai`},{default:h(()=>[...t[19]||=[o(`span`,null,`🤖 AI病虫害识别`,-1)]]),_:1}),p(m,{index:`technology`},{default:h(()=>[...t[20]||=[o(`span`,null,`📚 种植技术资料`,-1)]]),_:1}),p(m,{index:`products`},{default:h(()=>[...t[21]||=[o(`span`,null,`📦 我的货源`,-1)]]),_:1}),p(m,{index:`price`},{default:h(()=>[...t[22]||=[o(`span`,null,`💰 价格行情`,-1)]]),_:1}),p(m,{index:`trace`},{default:h(()=>[...t[23]||=[o(`span`,null,`🔗 溯源查询`,-1)]]),_:1})]),_:1},8,[`default-active`])]),_:1}),ie((a(),l(Dn,{class:`main-content`,"element-loading-text":`加载中...`},{default:h(()=>[u.value===`ai`?(a(),M(`div`,Te,[t[33]||=o(`h2`,null,`🤖 AI病虫害识别`,-1),p(Z,null,{default:h(()=>[t[32]||=o(`p`,{class:`tip`},`上传生姜叶片图片，AI将自动识别病虫害情况`,-1),o(`div`,Ee,[t[24]||=o(`div`,{class:`samples-header`},[o(`span`,{class:`samples-title`},`🎯 快速体验样品`),o(`span`,{class:`samples-tip`},`点击下方任意样品，立即体验 AI 识别效果`)],-1),o(`div`,De,[(a(),M(d,null,c(j,e=>o(`div`,{key:e.id,class:A([`sample-thumb`,{active:k.value===e.id}]),onClick:t=>I(e)},[o(`div`,ke,[o(`img`,{src:e.image,alt:e.name,class:`thumb-photo`},null,8,Ae)]),o(`div`,je,O(e.name),1)],10,Oe)),64))])]),o(`div`,Me,[o(`div`,{class:A([`mode-tab`,{active:!k.value}]),onClick:sn},[...t[25]||=[o(`span`,{class:`mode-icon`},`📤`,-1),o(`span`,null,`上传图片识别`,-1)]],2),(a(),M(d,null,c(j,e=>o(`div`,{key:`nav-`+e.id,class:A([`mode-tab`,{active:k.value===e.id}]),onClick:t=>I(e)},[t[26]||=o(`span`,{class:`mode-icon`},`🖼️`,-1),o(`span`,null,O(e.name),1)],10,Ne)),64))]),T.value?(a(),M(`div`,Pe,[o(`div`,Fe,[p(C,{style:{width:`160px`}})]),p(N,{gutter:16},{default:h(()=>[p(oe,{span:10},{default:h(()=>[p(C,{rows:5,animated:``})]),_:1}),p(oe,{span:14},{default:h(()=>[p(C,{rows:6,animated:``}),p(C,{style:{width:`80%`,"margin-top":`14px`},rows:3,animated:``})]),_:1})]),_:1})])):f(``,!0),o(`div`,Ie,[o(`div`,Le,[p(an,{class:`upload-area-small`,drag:``,action:`/api/v1/ai/disease-detect`,"on-success":rn,"on-error":cn,"before-upload":ln,"on-change":nn,"on-remove":on,name:`image`,accept:`image/*`,limit:1,"auto-upload":!0},{default:h(()=>[!x.value&&!k.value?(a(),M(`div`,Re,[p(G,{class:`el-icon--upload`},{default:h(()=>[p(b(w))]),_:1}),t[27]||=o(`div`,{class:`el-upload__text`},[n(` 拖拽图片`),o(`br`),n(`或 `),o(`em`,null,`点击上传`)],-1)])):k.value&&P.value?(a(),M(`div`,ze,[o(`img`,{src:P.value.image,alt:P.value.name,class:`sample-preview-photo`},null,8,Be),o(`div`,Ve,O(P.value.name),1),o(`button`,{type:`button`,class:`back-upload-btn`,onClick:ee(sn,[`stop`])},` ← 返回上传照片 `)])):(a(),M(`div`,{key:2,class:`upload-preview`,onClick:t[1]||=e=>S.value=!0},[o(`img`,{src:x.value,class:`preview-image-small`},null,8,He),o(`div`,Ue,[p(G,null,{default:h(()=>[p(b(ae))]),_:1}),t[28]||=n(` 点击查看大图`,-1)])]))]),_:1},8,[`action`])]),o(`div`,We,[_.value?(a(),M(`div`,Ge,[t[30]||=o(`h3`,null,`🔍 AI识别结果`,-1),p(Sn,{column:1,border:``,size:`small`},{default:h(()=>[p(X,{label:`检测结果`},{default:h(()=>[p(J,{type:_.value.disease===`健康`?`success`:`danger`,effect:`dark`},{default:h(()=>[n(O(_.value.disease),1)]),_:1},8,[`type`])]),_:1}),p(X,{label:`置信度`},{default:h(()=>[p(xn,{percentage:F.value,format:()=>ce.value,"stroke-width":10,color:_.value.disease===`健康`?`#67C23A`:`#F56C6C`},null,8,[`percentage`,`format`,`color`])]),_:1}),p(X,{label:`严重程度`},{default:h(()=>[p(J,{type:_.value.severity===`无`?`success`:`warning`},{default:h(()=>[n(O(_.value.severity),1)]),_:1},8,[`type`])]),_:1}),p(X,{label:`品级判定`},{default:h(()=>[p(J,{type:_.value.gradeType,effect:`dark`},{default:h(()=>[n(O(_.value.gradeLabel),1)]),_:1},8,[`type`])]),_:1}),p(X,{label:`建议收购价`},{default:h(()=>[o(`span`,Ke,`¥`+O(_.value.purchasePrice)+`/斤`,1)]),_:1}),p(X,{label:`姜辣素估算区间`},{default:h(()=>[o(`span`,qe,O(_.value.gingerolRange),1)]),_:1})]),_:1}),o(`div`,Je,[t[29]||=o(`h4`,null,`💡 农技处置 SOP`,-1),o(`ol`,Ye,[(a(!0),M(d,null,c(_.value.sopSteps,(e,t)=>(a(),M(`li`,{key:t},[o(`span`,Xe,O(t+1),1),o(`span`,Ze,O(e),1)]))),128))])])])):(a(),M(`div`,Qe,[p(G,{class:`placeholder-icon`},{default:h(()=>[p(b(ne))]),_:1}),t[31]||=o(`p`,null,`请上传图片或点击样品开始识别`,-1)]))])]),_.value?(a(),M(`div`,$e,[p(be,{diseaseResult:_.value},null,8,[`diseaseResult`])])):f(``,!0)]),_:1})])):f(``,!0),u.value===`technology`?(a(),M(`div`,et,[t[38]||=o(`h2`,null,`📚 种植技术资料`,-1),!H.value&&!K.value?(a(),M(`div`,tt,[(a(!0),M(d,null,c(V.value,e=>(a(),M(`div`,{key:e.key,class:`category-card`,onClick:t=>_e(e.key)},[o(`div`,rt,O(e.icon),1),o(`div`,it,O(e.name),1),o(`div`,at,O(he(e.key))+` 篇资料`,1)],8,nt))),128))])):H.value&&!K.value&&!U.value?(a(),M(`div`,ot,[o(`div`,st,[p(i,{type:`primary`,plain:``,size:`small`,onClick:ye},{default:h(()=>[p(G,null,{default:h(()=>[p(b(E))]),_:1}),t[34]||=n(` 返回全部分类 `,-1)]),_:1}),o(`span`,ct,O(de.value)+` `+O(Qt.value),1)]),(a(!0),M(d,null,c(pe.value,e=>(a(),M(`div`,{key:e.key,class:`category-card sub-category-card`,onClick:t=>ve(e.key)},[o(`div`,ut,O(me(e.key)),1),o(`div`,dt,O(e.name),1),o(`div`,ft,O(ge(e.key))+` 篇资料`,1)],8,lt))),128))])):H.value&&!K.value?(a(),M(`div`,pt,[o(`div`,mt,[p(i,{type:`primary`,plain:``,size:`small`,onClick:Zt},{default:h(()=>[p(G,null,{default:h(()=>[p(b(E))]),_:1}),t[35]||=n(` 返回上一级 `,-1)]),_:1}),o(`span`,ht,O(de.value)+` `+O(Qt.value)+` / `+O(fe.value),1)]),$t.value.length>0?(a(),M(`div`,gt,[(a(!0),M(d,null,c($t.value,e=>(a(),M(`div`,{key:e.id,class:`article-card`,onClick:t=>dn(e)},[o(`div`,vt,O(e.icon),1),o(`div`,yt,[o(`h4`,null,O(e.title),1),o(`p`,null,O(e.description),1),o(`div`,bt,[o(`span`,null,`📖 `+O(e.views),1),o(`span`,null,`⭐ `+O(e.rating),1)])]),p(i,{type:`primary`,size:`small`},{default:h(()=>[...t[36]||=[n(`查看`,-1)]]),_:1})],8,_t))),128))])):(a(),l(Cn,{key:1,description:`暂无相关资料`}))])):(a(),M(`div`,xt,[o(`div`,St,[p(i,{type:`primary`,plain:``,size:`small`,onClick:en},{default:h(()=>[p(G,null,{default:h(()=>[p(b(E))]),_:1}),t[37]||=n(` 返回列表 `,-1)]),_:1}),o(`span`,Ct,O(K.value.icon)+` `+O(K.value.title),1)]),o(`div`,wt,[o(`div`,{innerHTML:K.value.content},null,8,Tt)])])),p(Tn,{modelValue:un.value,"onUpdate:modelValue":t[2]||=e=>un.value=e,title:K.value?`${K.value.icon} ${K.value.title}`:`资料详情`,width:`720px`,class:`article-dialog`},{default:h(()=>[K.value?(a(),M(`div`,Et,[o(`div`,Dt,[p(J,{type:`success`,size:`small`},{default:h(()=>[n(`📖 阅读量 `+O(K.value.views),1)]),_:1}),p(J,{type:`warning`,size:`small`},{default:h(()=>[n(`⭐ 评分 `+O(K.value.rating),1)]),_:1}),p(J,{size:`small`},{default:h(()=>[n(`📅 发布于 `+O(K.value.publishTime||`2026-08-01`),1)]),_:1}),p(J,{type:`info`,size:`small`},{default:h(()=>[n(`📂 `+O(Qt.value)+` / `+O(fe.value),1)]),_:1})]),p(wn),o(`div`,{class:`dialog-content`,innerHTML:K.value.content},null,8,Ot)])):f(``,!0)]),_:1},8,[`modelValue`,`title`])])):f(``,!0),u.value===`products`?(a(),M(`div`,kt,[t[55]||=o(`h2`,null,`📦 我的货源`,-1),o(`div`,At,[p(i,{type:`primary`,onClick:t[3]||=e=>R.value=!0},{default:h(()=>[...t[39]||=[n(`+ 添加货源`,-1)]]),_:1}),p(i,{type:`success`,onClick:fn,loading:q.value},{default:h(()=>[p(G,null,{default:h(()=>[p(b(re))]),_:1}),t[40]||=n(` 刷新 `,-1)]),_:1},8,[`loading`])]),L.value.length===0&&!q.value?(a(),l(Cn,{key:0,description:`暂无货源数据，点击「添加货源」上架您的第一批小黄姜`})):ie((a(),l(En,{key:1,data:L.value,class:`desktop-only`,style:{width:`100%`},border:``,"element-loading-text":`加载中...`},{default:h(()=>[p(Q,{prop:`id`,label:`编号`,width:`80`}),p(Q,{prop:`origin`,label:`产地`}),p(Q,{prop:`weight`,label:`重量(斤)`}),p(Q,{prop:`price`,label:`价格(元/斤)`,width:`120`},{default:h(({row:e})=>[p(J,{type:`primary`},{default:h(()=>[n(`¥`+O(e.price),1)]),_:2},1024)]),_:1}),p(Q,{prop:`harvestDate`,label:`采收日期`}),p(Q,{prop:`grade`,label:`等级`,width:`100`},{default:h(({row:e})=>[p(J,{type:vn(e.grade)},{default:h(()=>[n(O(yn(e.grade)),1)]),_:2},1032,[`type`])]),_:1}),p(Q,{prop:`status`,label:`状态`,width:`100`},{default:h(({row:e})=>[p(J,{type:e.status===`available`?`success`:`info`},{default:h(()=>[n(O(e.status===`available`?`待售`:`已售`),1)]),_:2},1032,[`type`])]),_:1}),p(Q,{label:`操作`,width:`200`},{default:h(({row:e})=>[p(i,{type:`success`,size:`small`,onClick:t=>hn(e)},{default:h(()=>[...t[41]||=[n(`修改`,-1)]]),_:1},8,[`onClick`]),p(i,{type:`danger`,size:`small`,onClick:t=>gn(e)},{default:h(()=>[...t[42]||=[n(`删除`,-1)]]),_:1},8,[`onClick`])]),_:1})]),_:1},8,[`data`])),[[In,q.value]]),o(`div`,jt,[(a(!0),M(d,null,c(L.value,e=>(a(),M(`div`,{key:e.id,class:`mobile-card`},[o(`div`,Mt,[o(`span`,Nt,O(e.origin),1),p(J,{type:e.status===`available`?`success`:`info`,size:`small`},{default:h(()=>[n(O(e.status===`available`?`待售`:`已售`),1)]),_:2},1032,[`type`])]),o(`div`,Pt,[o(`div`,Ft,[t[43]||=o(`span`,null,`⚖️ 重量`,-1),o(`span`,null,O(e.weight)+`斤`,1)]),o(`div`,It,[t[44]||=o(`span`,null,`💰 单价`,-1),o(`span`,Lt,`¥`+O(e.price)+`/斤`,1)]),o(`div`,Rt,[t[45]||=o(`span`,null,`📅 采收`,-1),o(`span`,null,O(e.harvestDate),1)]),o(`div`,zt,[t[46]||=o(`span`,null,`🏷️ 等级`,-1),o(`span`,null,O(yn(e.grade)),1)])]),o(`div`,Bt,[p(i,{type:`success`,size:`small`,onClick:t=>hn(e)},{default:h(()=>[...t[47]||=[n(`修改`,-1)]]),_:1},8,[`onClick`]),p(i,{type:`danger`,size:`small`,onClick:t=>gn(e)},{default:h(()=>[...t[48]||=[n(`删除`,-1)]]),_:1},8,[`onClick`])])]))),128))]),o(`div`,Vt,[p(Z,{class:`stat-card`},{default:h(()=>[t[50]||=o(`div`,{class:`stat-icon`},`📦`,-1),o(`div`,Ht,[o(`div`,Ut,O(L.value.length),1),t[49]||=o(`div`,{class:`stat-label`},`货源总数`,-1)])]),_:1}),p(Z,{class:`stat-card`},{default:h(()=>[t[52]||=o(`div`,{class:`stat-icon`},`✅`,-1),o(`div`,Wt,[o(`div`,Gt,O(le.value),1),t[51]||=o(`div`,{class:`stat-label`},`待售数量`,-1)])]),_:1}),p(Z,{class:`stat-card`},{default:h(()=>[t[54]||=o(`div`,{class:`stat-icon`},`💰`,-1),o(`div`,Kt,[o(`div`,qt,`¥`+O(ue.value),1),t[53]||=o(`div`,{class:`stat-label`},`预估总价`,-1)])]),_:1})])])):f(``,!0),u.value===`price`?(a(),M(`div`,Jt,[t[56]||=o(`h2`,null,`💰 价格行情`,-1),p(se)])):f(``,!0)]),_:1})),[[In,_n.value]])]),_:1})]),_:1}),o(`div`,Yt,[o(`div`,{class:A([`tab-item`,{active:u.value===`ai`}]),onClick:t[4]||=e=>Y(`ai`)},[...t[57]||=[o(`span`,{class:`tab-icon`},`🤖`,-1),o(`span`,null,`AI识别`,-1)]],2),o(`div`,{class:A([`tab-item`,{active:u.value===`technology`}]),onClick:t[5]||=e=>Y(`technology`)},[...t[58]||=[o(`span`,{class:`tab-icon`},`📚`,-1),o(`span`,null,`技术`,-1)]],2),o(`div`,{class:A([`tab-item`,{active:u.value===`products`}]),onClick:t[6]||=e=>Y(`products`)},[...t[59]||=[o(`span`,{class:`tab-icon`},`📦`,-1),o(`span`,null,`货源`,-1)]],2),o(`div`,{class:A([`tab-item`,{active:u.value===`price`}]),onClick:t[7]||=e=>Y(`price`)},[...t[60]||=[o(`span`,{class:`tab-icon`},`💰`,-1),o(`span`,null,`行情`,-1)]],2),o(`div`,{class:A([`tab-item`,{active:u.value===`trace`}]),onClick:t[8]||=e=>Y(`trace`)},[...t[61]||=[o(`span`,{class:`tab-icon`},`🔗`,-1),o(`span`,null,`溯源`,-1)]],2)]),p(Tn,{"model-value":R.value,title:z.value?`修改货源`:`添加货源`,width:`500px`},{footer:h(()=>[p(i,{onClick:pn},{default:h(()=>[...t[63]||=[n(`取消`,-1)]]),_:1}),p(i,{type:`primary`,onClick:mn},{default:h(()=>[n(O(z.value?`保存修改`:`提交`),1)]),_:1})]),default:h(()=>[p(Pn,{model:B,"label-width":`100px`},{default:h(()=>[p($,{label:`产地`,required:``},{default:h(()=>[p(kn,{modelValue:B.origin,"onUpdate:modelValue":t[9]||=e=>B.origin=e,placeholder:`请输入产地，如：云南省罗平县`},null,8,[`modelValue`])]),_:1}),p($,{label:`重量(斤)`,required:``},{default:h(()=>[p(An,{modelValue:B.weight,"onUpdate:modelValue":t[10]||=e=>B.weight=e,min:.1,step:.1,placeholder:`请输入重量`},null,8,[`modelValue`])]),_:1}),p($,{label:`价格(元/斤)`,required:``},{default:h(()=>[p(An,{modelValue:B.price,"onUpdate:modelValue":t[11]||=e=>B.price=e,min:.01,precision:2,placeholder:`请输入价格`},null,8,[`modelValue`])]),_:1}),p($,{label:`采收日期`,required:``},{default:h(()=>[p(jn,{modelValue:B.harvestDate,"onUpdate:modelValue":t[12]||=e=>B.harvestDate=e,type:`date`,placeholder:`选择采收日期`},null,8,[`modelValue`])]),_:1}),p($,{label:`等级`,required:``},{default:h(()=>[p(Nn,{modelValue:B.grade,"onUpdate:modelValue":t[13]||=e=>B.grade=e,placeholder:`选择等级`},{default:h(()=>[p(Mn,{label:`A级（优质）`,value:`A`}),p(Mn,{label:`B级（良好）`,value:`B`}),p(Mn,{label:`C级（普通）`,value:`C`})]),_:1},8,[`modelValue`])]),_:1}),p($,{label:`产品描述`},{default:h(()=>[p(kn,{modelValue:B.description,"onUpdate:modelValue":t[14]||=e=>B.description=e,type:`textarea`,rows:3,placeholder:`请描述产品特点...`},null,8,[`modelValue`])]),_:1}),p($,{label:`产品图片`},{default:h(()=>[p(an,{class:`upload-area`,drag:``,action:`/api/v1/product/upload`,"on-success":bn,"on-error":cn,name:`image`,accept:`image/*`},{default:h(()=>[p(G,{class:`el-icon--upload`},{default:h(()=>[p(b(w))]),_:1}),t[62]||=o(`div`,{class:`el-upload__text`},[n(` 拖拽图片到此处或 `),o(`em`,null,`点击上传`)],-1)]),_:1},8,[`action`]),B.imageUrl?(a(),M(`img`,{key:0,src:W+B.imageUrl,class:`preview-image`},null,8,Xt)):f(``,!0)]),_:1})]),_:1},8,[`model`])]),_:1},8,[`model-value`,`title`]),S.value?(a(),l(Fn,{key:0,"url-list":x.value?[x.value]:[],onClose:t[15]||=e=>S.value=!1},null,8,[`url-list`])):f(``,!0)])}}},[[`__scopeId`,`data-v-b689a659`]]);export{Zt as default};