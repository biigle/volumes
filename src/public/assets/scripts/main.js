biigle.$viewModel("annotation-session-panel",function(e){var t=biigle.$require("messages.store"),i=biigle.$require("api.volumes"),s=biigle.$require("api.annotationSessions"),n=biigle.$require("volumes.id"),r=new Date,o=function(){return{name:null,description:null,starts_at_iso8601:null,starts_at:null,ends_at_iso8601:null,ends_at:null,hide_other_users_annotations:!1,hide_own_annotations:!1,users:[]}},a={props:["session","editing","editId"],computed:{title:function(){return this.editing?"Edit this annotation session":this.session.name},active:function(){return this.session.starts_at_iso8601<r&&this.session.ends_at_iso8601>=r},currentlyEdited:function(){return this.session.id===this.editId},classObject:function(){return{"session--active":this.active,"list-group-item-info":this.currentlyEdited}}},methods:{edit:function(){this.editing&&!this.currentlyEdited&&this.$emit("edit",this.session)}}},l={props:["user"],computed:{name:function(){return this.user.firstname+" "+this.user.lastname},title:function(){return"Remove "+this.name}},methods:{remove:function(){this.$emit("remove",this.user)}}};new Vue({el:e,mixins:[biigle.$require("core.mixins.loader"),biigle.$require("core.mixins.editor")],data:{sessions:biigle.$require("volumes.annotationSessions"),editedSession:o(),users:[],errors:{}},components:{typeahead:biigle.$require("core.components.typeahead"),listItem:a,userTag:l,datepicker:VueStrap.datepicker},computed:{classObject:function(){return{"panel-warning panel--editing":this.editing}},hasSessions:function(){return this.sessions.length>0},hasNewSession:function(){return void 0===this.editedSession.id},availableUsers:function(){var e=this.editedSession.users.map(function(e){return e.id});return this.users.filter(function(t){return-1===e.indexOf(t.id)})},orderedSessions:function(){return this.sessions.sort(function(e,t){return t.starts_at_iso8601.getTime()-e.starts_at_iso8601.getTime()})}},methods:{clone:function(e){return JSON.parse(JSON.stringify(e))},startLoading:function(){this.errors={},this.loading=!0},submit:function(e){if(!this.loading){this.startLoading();var t=this,i=this.editedSession;if(this.hasNewSession)s.save({volume_id:n},this.packSession(i)).then(this.sessionSaved).catch(this.handleErrorResponse).finally(this.finishLoading);else{var r={id:i.id};!0===e&&(r.force=1),s.update(r,this.packSession(i)).then(function(){t.sessionUpdated(i)}).catch(this.handleConfirm("Use the Force and update the annotation session?",this.submit)).finally(this.finishLoading)}}},sessionUpdated:function(e){for(var t=this.sessions.length-1;t>=0;t--)this.sessions[t].id===e.id&&(this.sessions.splice(t,1,e),this.clearEditedSession())},sessionSaved:function(e){this.sessions.push(this.parseSession(e.data)),this.clearEditedSession()},packSession:function(e){return e=this.clone(e),e.users=e.users.map(function(e){return e.id}),e.starts_at=e.starts_at_iso8601,e.ends_at=e.ends_at_iso8601,delete e.starts_at_iso8601,delete e.ends_at_iso8601,e},handleConfirm:function(e,t){var i=this;return function(s){400===s.status?(i.finishLoading(),confirm(s.data.message+" "+e)&&t(!0)):this.handleErrorResponse(s)}},handleErrorResponse:function(e){422===e.status?this.errors=e.data:t.handleErrorResponse(e)},hasError:function(e){return this.errors.hasOwnProperty(e)},getError:function(e){return this.errors[e].join(" ")},editSession:function(e){this.editedSession=this.clone(e)},deleteSession:function(e){if(!this.loading&&!this.hasNewSession&&(!0===e||confirm("Are you sure you want to delete the annotation session '"+this.editedSession.name+"'?"))){this.startLoading();var t=this,i=this.editedSession.id,n={id:i};!0===e&&(n.force=1),s.delete(n).then(function(){t.sessionDeleted(i)}).catch(this.handleConfirm("Use the Force and delete the annotation session?",this.deleteSession)).finally(this.finishLoading)}},sessionDeleted:function(e){for(var t=this.sessions.length-1;t>=0;t--)if(this.sessions[t].id===e)return this.sessions.splice(t,1),void this.clearEditedSession()},clearEditedSession:function(){this.editedSession=o()},loadUsers:function(){i.queryUsers({id:n}).then(this.usersLoaded,t.handleErrorResponse)},usersLoaded:function(e){e.data.forEach(function(e){e.name=e.firstname+" "+e.lastname}),Vue.set(this,"users",e.data)},selectUser:function(e){this.editedSession.users.push(e)},removeUser:function(e){for(var t=this.editedSession.users.length-1;t>=0;t--)this.editedSession.users[t].id===e.id&&this.editedSession.users.splice(t,1)},stringifyDate:function(e){var t=e.getMonth()+1;return t=t<10?"0"+t:t,e.getFullYear()+"-"+t+"-"+e.getDate()},parseDate:function(e){if(e)return e=e.split("-"),new Date(e[0],e[1]-1,e[2])},parseSession:function(e){var t=new Date(e.starts_at_iso8601);return e.starts_at_iso8601=t,e.starts_at=this.stringifyDate(t),t=new Date(e.ends_at_iso8601),e.ends_at_iso8601=t,e.ends_at=this.stringifyDate(t),e},setStartsAt:function(e){this.editedSession.starts_at_iso8601=this.parseDate(e),this.editedSession.starts_at=e},setEndsAt:function(e){this.editedSession.ends_at_iso8601=this.parseDate(e),this.editedSession.ends_at=e}},created:function(){this.sessions.map(this.parseSession),this.$once("editing.start",this.loadUsers)}})}),biigle.$viewModel("volume-dashboard-hot-box-right",function(e){new Vue({el:e,components:{volumeThumbnail:biigle.$require("projects.components.volumeThumbnail")}})}),biigle.$viewModel("image-panel",function(e){var t=biigle.$require("messages.store"),i=biigle.$require("volumes.id"),s={props:["image"],computed:{classObject:function(){return{"list-group-item-success":this.image.isNew}},title:function(){return"Delete image #"+this.image.id}},methods:{remove:function(){this.$emit("remove",this.image)}}};new Vue({el:e,mixins:[biigle.$require("core.mixins.loader"),biigle.$require("core.mixins.editor")],data:{filenames:"",images:[],errors:{}},components:{imageItem:s},computed:{classObject:function(){return{"panel-warning panel--editing":this.editing}},orderedImages:function(){return this.images.sort(function(e,t){return e.filename<t.filename?-1:1})},hasImages:function(){return this.images.length>0}},methods:{startLoading:function(){this.errors={},this.loading=!0},submit:function(){this.loading||(this.startLoading(),biigle.$require("api.volumes").saveImages({id:i},{images:this.filenames}).then(this.imagesSaved).catch(this.handleErrorResponse).finally(this.finishLoading))},imagesSaved:function(e){for(var t=e.data.length-1;t>=0;t--)e.data[t].isNew=!0,this.images.push(e.data[t]);this.filenames=""},handleRemove:function(e){if(!this.loading&&confirm("Do you really want to delete the image #"+e.id+" ("+e.filename+")? All annotations will be lost!")){this.startLoading();var i=this;biigle.$require("api.images").delete({id:e.id}).then(function(){i.imageRemoved(e.id)}).catch(t.handleErrorResponse).finally(this.finishLoading)}},imageRemoved:function(e){for(var t=this.images,i=t.length-1;i>=0;i--)if(t[i].id===e)return void t.splice(i,1)},handleErrorResponse:function(e){422===e.status?this.errors=e.data:t.handleErrorResponse(e)},hasError:function(e){return this.errors.hasOwnProperty(e)},getError:function(e){return this.errors[e]}},created:function(){var e=biigle.$require("volumes.images");for(var t in e)e.hasOwnProperty(t),this.images.push({id:t,filename:e[t]})}})}),biigle.$viewModel("volume-metadata-upload",function(e){var t=biigle.$require("messages.store"),i=biigle.$require("api.volumeImageMetadata"),s=biigle.$require("volumes.id");new Vue({el:e,data:{loading:!1,csv:void 0,error:!1,success:!1,message:void 0},methods:{handleSuccess:function(){this.error=!1,this.success=!0},handleError:function(e){this.success=!1,e.data.file?Array.isArray(e.data.file)?this.error=e.data.file[0]:this.error=e.data.file:t.handleErrorResponse(e)},submit:function(e){if(this.csv){this.loading=!0;var t=new FormData;t.append("file",this.csv),i.save({id:s},t).bind(this).then(this.handleSuccess,this.handleError).finally(function(){this.loading=!1})}},setCsv:function(e){this.csv=e.target.files[0]}}})}),biigle.$viewModel("search-results",function(e){new Vue({el:e,components:{volumeThumbnail:biigle.$require("projects.components.volumeThumbnail")}})}),biigle.$declare("volumes.urlParams",new Vue({data:{params:{}},methods:{setSlug:function(e){var t=window.location.pathname.replace(/\/$/,""),i=t.substring(0,t.lastIndexOf("/")+1)+e;this.replaceState(window.location.href.replace(t,i))},set:function(e){this.params=e,this.updateSearch()},unset:function(e){delete this.params[e],this.updateSearch()},get:function(e){return this.params[e]},updateSearch:function(){var e=[],t=window.location.href;for(var i in this.params)this.params.hasOwnProperty(i)&&e.push(i+"="+this.params[i]);e=e.length>0?"?"+e.join("&"):"",window.location.search?this.replaceState(t.replace(window.location.search,e)):-1!==t.indexOf("#")?window.location.hash?this.replaceState(t.replace(window.location.hash,e+window.location.hash)):this.replaceState(t.slice(0,-1)+e):this.replaceState(t+e)},replaceState:function(e){history.replaceState(null,null,e)}},created:function(){var e=window.location.search.substr(1);if(e){e=e.split("&");for(var t,i=e.length-1;i>=0;i--)t=e[i].split("="),this.params[t[0]]=t[1]}}})),biigle.$viewModel("volume-container",function(e){var t=biigle.$require("volumes.imageIds"),i=biigle.$require("volumes.imageUuids"),s=biigle.$require("volumes.thumbUri"),n=biigle.$require("volumes.annotateUri"),r=biigle.$require("volumes.imageUri"),o=biigle.$require("events"),a=biigle.$require("volumes.urlParams");new Vue({el:e,mixins:[biigle.$require("core.mixins.loader")],components:{sidebar:biigle.$require("core.components.sidebar"),sidebarTab:biigle.$require("core.components.sidebarTab"),imageGrid:biigle.$require("volumes.components.volumeImageGrid"),filterTab:biigle.$require("volumes.components.filterTab"),sortingTab:biigle.$require("volumes.components.sortingTab"),labelsTab:biigle.$require("volumes.components.labelsTab")},data:{imageIds:t,images:[],filterSequence:t,filterMode:null,filterActive:!1,sortingSequence:t,sortingActive:!1,volumeId:biigle.$require("volumes.volumeId"),imageLabelMode:!1,selectedLabel:null},computed:{sortingMap:function(){var e={};return this.sortingSequence.forEach(function(t,i){e[t]=i}),e},sortedImages:function(){var e=this.sortingMap,t=[];return this.images.forEach(function(i){t[e[i.id]]=i}),t},filterMap:function(){var e={};return this.filterSequence.forEach(function(t){e[t]=null}),e},imagesToShow:function(){var e=this.filterMap;return"flag"===this.filterMode?this.sortedImages.map(function(t){return t.flagged=e.hasOwnProperty(t.id),t}):this.sortedImages.filter(function(t){return t.flagged=!1,e.hasOwnProperty(t.id)})},imageIdsToShow:function(){return this.imagesToShow.map(function(e){return e.id})},imagesStorageKey:function(){return"biigle.volumes."+this.volumeId+".images"},offsetStorageKey:function(){return"biigle.volumes."+this.volumeId+".offset"},initialOffset:function(){return parseInt(a.get("offset"))||parseInt(localStorage.getItem(this.offsetStorageKey))||0},filterEmpty:function(){return this.filterActive&&0===this.filterSequence.length}},methods:{handleSidebarToggle:function(){this.$nextTick(function(){this.$refs.imageGrid.$emit("resize")})},handleSidebarOpen:function(e){this.imageLabelMode="labels"===e},handleSidebarClose:function(e){this.imageLabelMode=!1},toggleLoading:function(e){this.loading=e},updateFilterSequence:function(e,t,i){this.filterSequence=e,this.filterMode=t,this.filterActive=i},handleImageGridScroll:function(e){e>0?(a.set({offset:e}),localStorage.setItem(this.offsetStorageKey,e)):(a.unset("offset"),localStorage.removeItem(this.offsetStorageKey))},handleSelectedLabel:function(e){this.selectedLabel=e},handleDeselectedLabel:function(e){this.selectedLabel=null},updateSortingSequence:function(e,t){this.sortingSequence=e,this.sortingActive=t}},watch:{imageIdsToShow:function(e){var t=this.imageIds,i=e.length===t.length;if(i)for(var s=e.length-1;s>=0;s--)if(e[s]!==t[s]){i=!1;break}i?localStorage.removeItem(this.imagesStorageKey):localStorage.setItem(this.imagesStorageKey,JSON.stringify(e)),o.$emit("volumes.images.count",e.length)}},created:function(){var e=this.imageIds.map(function(e){return{id:e,url:s.replace("{uuid}",i[e]),annotateUrl:n.replace("{id}",e),imageUrl:r.replace("{id}",e),flagged:!1}});Vue.set(this,"images",e)}})}),biigle.$viewModel("volume-image-count",function(e){var t=biigle.$require("volumes.imageIds"),i=biigle.$require("events");new Vue({el:e,data:{count:t.length},computed:{text:function(){return this.count===t.length?this.count:this.count+" of "+t.length}},created:function(){var e=this;i.$on("volumes.images.count",function(t){e.count=t})}})}),biigle.$declare("api.annotationSessions",Vue.resource("api/v1/annotation-sessions{/id}",{},{query:{method:"GET",url:"api/v1/volumes{/volume_id}/annotation-sessions"},save:{method:"POST",url:"api/v1/volumes{/volume_id}/annotation-sessions"}})),biigle.$declare("api.imageLabels",Vue.resource("api/v1/image-labels{/id}",{},{query:{method:"GET",url:"api/v1/images{/image_id}/labels"},save:{method:"POST",url:"api/v1/images{/image_id}/labels"}})),biigle.$declare("api.volumeImageMetadata",Vue.resource("api/v1/volumes{/id}/images/metadata")),biigle.$declare("api.volumes",Vue.resource("api/v1/volumes{/id}",{},{queryImagesWithImageLabels:{method:"GET",url:"api/v1/volumes{/id}/images/filter/labels"},queryImagesWithImageLabel:{method:"GET",url:"api/v1/volumes{/id}/images/filter/image-label{/label_id}"},queryImagesWithImageLabelFromUser:{method:"GET",url:"api/v1/volumes{/id}/images/filter/image-label-user{/user_id}"},queryImagesWithFilename:{method:"GET",url:"api/v1/volumes{/id}/images/filter/filename{/pattern}"},queryImageLabels:{method:"GET",url:"api/v1/volumes{/id}/image-labels"},queryUsers:{method:"GET",url:"api/v1/volumes{/id}/users"},queryImages:{method:"GET",url:"api/v1/volumes{/id}/images"},saveImages:{method:"POST",url:"api/v1/volumes{/id}/images"}})),biigle.$component("volumes.components.filterListComponent",{template:'<span><strong>with<span v-if="rule.negate">out</span></strong> <span v-text="name"></span> <strong v-if="dataName" v-text="dataName"></strong></span>',props:{rule:{type:Object,required:!0}},data:function(){return{name:this.rule.id}},computed:{dataName:function(){if(this.rule.data)return this.rule.data.name}}}),biigle.$component("volumes.components.filterSelectComponent",{template:'<div class="filter-select"><typeahead :items="items" :value="value" :placeholder="placeholder" @select="select"></typeahead><button type="submit" class="btn btn-default" @click="submit" :disabled="!selectedItem">Add rule</button></div>',components:{typeahead:biigle.$require("core.components.typeahead")},props:{volumeId:{type:Number,required:!0}},data:function(){return{items:[],placeholder:"",selectedItem:null}},computed:{value:function(){return this.selectedItem?this.selectedItem.name:""}},methods:{select:function(e){this.selectedItem=e},gotItems:function(e){this.items=e.data},parseUsernames:function(e){return e.data=e.data.map(function(e){return e.name=e.firstname+" "+e.lastname,e}),e},submit:function(){this.$emit("select",this.selectedItem)}}}),biigle.$component("volumes.components.filterTab",{mixins:[biigle.$require("core.mixins.loader")],props:{volumeId:{type:Number,required:!0},imageIds:{type:Array,required:!0}},data:function(){return{filters:biigle.$require("volumes.stores.filters"),rules:[],selectedFilterId:null,negate:!1,mode:"filter",operator:"and"}},computed:{selectedFilter:function(){return this.getFilter(this.selectedFilterId)},hasSelectComponent:function(){return this.selectedFilter&&this.selectedFilter.selectComponent},selectComponent:function(){return this.selectedFilter.selectComponent},hasRules:function(){return this.rules.length>0},sequence:function(){if(!this.hasRules)return this.imageIds;var e={},t={},i=0,s=0;return this.rules.forEach(function(n){n.negate?(i++,n.sequence.forEach(function(e){t[e]=t[e]+1||1})):(s++,n.sequence.forEach(function(t){e[t]=e[t]+1||1}))}),"and"===this.operator?s>0?this.imageIds.filter(function(i){return e[i]===s&&!t.hasOwnProperty(i)}):this.imageIds.filter(function(e){return!t.hasOwnProperty(e)}):i>0?this.imageIds.filter(function(s){return e.hasOwnProperty(s)||t[s]!==i}):this.imageIds.filter(function(t){return e.hasOwnProperty(t)})},inFilterMode:function(){return"filter"===this.mode},inFlagMode:function(){return"flag"===this.mode},usesAndOperator:function(){return"and"===this.operator},usesOrOperator:function(){return"or"===this.operator},helpText:function(){return this.selectedFilter?this.selectedFilter.help:null},rulesStorageKey:function(){return"biigle.volumes."+biigle.$require("volumes.volumeId")+".filter2.rules"},modeStorageKey:function(){return"biigle.volumes."+biigle.$require("volumes.volumeId")+".filter2.mode"},operatorStorageKey:function(){return"biigle.volumes."+biigle.$require("volumes.volumeId")+".filter2.operator"}},methods:{filterValid:function(e){return"string"==typeof e.id&&"string"==typeof e.label&&"object"==typeof e.listComponent&&"function"==typeof e.getSequence},getFilter:function(e){for(var t=this.filters.length-1;t>=0;t--)if(this.filters[t].id===e)return this.filters[t];return null},hasRule:function(e){return-1!==this.rules.findIndex(function(t){return t.id===e.id&&t.negate===e.negate&&t.data===e.data})},addRule:function(e){if(this.selectedFilter){var t={id:this.selectedFilter.id,data:e,negate:this.negate};if(!this.hasRule(t)){this.startLoading();var i=this;this.selectedFilter.getSequence(this.volumeId,e).catch(biigle.$require("messages.store").handleErrorResponse).then(function(e){i.ruleAdded(t,e)}).finally(this.finishLoading)}}},refreshRule:function(e){var t=this.getFilter(e.id);t&&(this.startLoading(),t.getSequence(this.volumeId,e.data).catch(biigle.$require("messages.store").handleErrorResponse).then(function(t){e.sequence=t.data}).finally(this.finishLoading))},ruleAdded:function(e,t){e.sequence=t.data,this.rules.push(e)},removeRule:function(e){this.rules.splice(e,1)},reset:function(){this.rules=[],this.selectedFilterId=null,this.negate=!1,this.mode="filter",this.operator="and"},activateFilterMode:function(){this.mode="filter"},activateFlagMode:function(){this.mode="flag"},activateAndOperator:function(){this.operator="and"},activateOrOperator:function(){this.operator="or"},emitUpdate:function(){this.$emit("update",this.sequence,this.mode,this.hasRules)},getListComponent:function(e){for(var t=this.filters.length-1;t>=0;t--)if(this.filters[t].id===e.id)return this.filters[t].listComponent}},watch:{sequence:function(){this.emitUpdate()},mode:function(){this.emitUpdate(),"filter"!==this.mode?localStorage.setItem(this.modeStorageKey,this.mode):localStorage.removeItem(this.modeStorageKey)},operator:function(){this.emitUpdate(),"and"!==this.operator?localStorage.setItem(this.operatorStorageKey,this.operator):localStorage.removeItem(this.operatorStorageKey)},rules:{handler:function(){this.rules.length>0?localStorage.setItem(this.rulesStorageKey,JSON.stringify(this.rules)):localStorage.removeItem(this.rulesStorageKey)},deep:!0}},created:function(){for(var e,t=0;t<this.filters.length;t++)e=this.filters[t],this.filterValid(e)||(console.error("Filter "+e.id+" invalid. Ignoring..."),this.filters.splice(t,1));var i=JSON.parse(localStorage.getItem(this.rulesStorageKey));i&&Vue.set(this,"rules",i);var s=localStorage.getItem(this.modeStorageKey);s&&(this.mode=s);var n=localStorage.getItem(this.operatorStorageKey);n&&(this.operator=n)}}),biigle.$component("volumes.components.imageGrid",{template:'<div class="image-grid" @wheel.prevent="scroll"><div class="image-grid__images" ref="images"><image-grid-image v-for="image in displayedImages" :key="image.id" :image="image" :empty-url="emptyUrl" @select="emitSelect" @deselect="emitDeselect"></image-grid-image></div><image-grid-progress v-if="canScroll" :progress="progress" @top="jumpToStart" @prev-page="reversePage" @prev-row="reverseRow" @jump="jumpToPercent" @next-row="advanceRow" @next-page="advancePage" @bottom="jumpToEnd"></image-grid-progress></div>',data:function(){return{clientWidth:0,clientHeight:0,privateOffset:0}},components:{imageGridImage:biigle.$require("volumes.components.imageGridImage"),imageGridProgress:biigle.$require("volumes.components.imageGridProgress")},props:{images:{type:Array,required:!0},emptyUrl:{type:String,required:!0},width:{type:Number,default:135},height:{type:Number,default:180},margin:{type:Number,default:8},initialOffset:{type:Number,default:0}},computed:{columns:function(){return Math.max(1,Math.floor(this.clientWidth/(this.width+this.margin)))},rows:function(){return Math.max(1,Math.floor(this.clientHeight/(this.height+this.margin)))},displayedImages:function(){return this.images.slice(this.offset,this.offset+this.columns*this.rows)},offset:{get:function(){return this.privateOffset},set:function(e){this.privateOffset=Math.max(0,Math.min(this.lastRow*this.columns,e))}},progress:function(){return this.offset/(this.columns*this.lastRow)},lastRow:function(){return Math.max(0,Math.ceil(this.images.length/this.columns)-this.rows)},canScroll:function(){return this.lastRow>0}},methods:{updateDimensions:function(){this.clientHeight=this.$refs.images.clientHeight,this.clientWidth=this.$refs.images.clientWidth,this.offset=this.offset},scrollRows:function(e){this.offset=this.offset+this.columns*e},scroll:function(e){this.scrollRows(e.deltaY>=0?1:-1)},advanceRow:function(){this.scrollRows(1)},advancePage:function(){this.scrollRows(this.rows)},reverseRow:function(){this.scrollRows(-1)},reversePage:function(){this.scrollRows(-this.rows)},jumpToPercent:function(e){this.offset=this.columns*Math.round(this.lastRow*e)},jumpToStart:function(){this.jumpToPercent(0)},jumpToEnd:function(){this.jumpToPercent(1)},emitSelect:function(e){this.$emit("select",e)},emitDeselect:function(e){this.$emit("deselect",e)}},watch:{images:function(){this.offset=this.offset},offset:function(){this.$emit("scroll",this.offset)}},created:function(){var e=biigle.$require("keyboard");e.on(38,this.reverseRow),e.on("w",this.reverseRow),e.on(40,this.advanceRow),e.on("s",this.advanceRow),e.on(37,this.reversePage),e.on("a",this.reversePage),e.on(39,this.advancePage),e.on("d",this.advancePage),e.on(33,this.reversePage),e.on(34,this.advancePage),e.on(36,this.jumpToStart),e.on(35,this.jumpToEnd),this.offset=this.initialOffset},mounted:function(){window.addEventListener("resize",this.updateDimensions),this.$on("resize",this.updateDimensions),this.$nextTick(this.updateDimensions),this.$watch("canScroll",this.updateDimensions)}}),biigle.$component("volumes.components.imageGridImage",{template:'<figure class="image-grid__image" :class="classObject"><img @click="toggleSelect" :src="url || emptyUrl" @error="showEmptyImage"></figure>',data:function(){return{url:"",timeout:null}},props:{image:{type:Object,required:!0},emptyUrl:{type:String,required:!0}},computed:{classObject:function(){return{"image-grid__image--selected":this.selected}},selected:function(){return!1}},methods:{toggleSelect:function(){this.selected?this.$emit("deselect",this.image):this.$emit("select",this.image)},gotBlob:function(e){var t=window.URL||window.webkitURL;this.url=t.createObjectURL(e.body),this.image.blob=this.url},showEmptyImage:function(){this.url=this.emptyUrl}},created:function(){if(this.image.url)this.url=this.image.url;else if(this.image.blob)this.url=this.image.blob;else if(this.getUrl)this.url=this.getUrl();else if(this.getBlob){var e=this;this.timeout=setTimeout(function(){e.getBlob().then(e.gotBlob)},50)}},beforeDestroy:function(){clearTimeout(this.timeout)}}),biigle.$component("volumes.components.imageGridProgress",{template:'<div class="image-grid-progress"><div class="btn-group-vertical"><button type="button" class="btn btn-default btn-xs" title="Go to top 𝗛𝗼𝗺𝗲" @click="top" :disabled="isAtTop"><span class="glyphicon glyphicon-fast-backward"></span></button><button type="button" class="btn btn-default btn-xs" title="Previous page 𝗣𝗮𝗴𝗲 𝘂𝗽/𝗔𝗿𝗿𝗼𝘄 𝗹𝗲𝗳𝘁" @click="prevPage" :disabled="isAtTop"><span class="glyphicon glyphicon-step-backward"></span></button><button type="button" class="btn btn-default btn-xs" title="Previous row 𝗔𝗿𝗿𝗼𝘄 𝘂𝗽" @click="prevRow" :disabled="isAtTop"><span class="glyphicon glyphicon-triangle-left"></span></button></div><div class="image-grid-progress__bar" @mousedown="beginScrolling" @mouseup="stopScrolling" @mouseleave="stopScrolling" @mousemove.prevent="scroll" @click="jump"><div class="image-grid-progress__wrapper"><div class="image-grid-progress__inner" :style="{height: progressHeight}"></div></div></div><div class="btn-group-vertical"><button type="button" class="btn btn-default btn-xs" title="Next row 𝗔𝗿𝗿𝗼𝘄 𝗱𝗼𝘄𝗻" @click="nextRow" :disabled="isAtBottom"><span class="glyphicon glyphicon-triangle-right"></span></button><button type="button" class="btn btn-default btn-xs" title="Next page 𝗣𝗮𝗴𝗲 𝗱𝗼𝘄𝗻/𝗔𝗿𝗿𝗼𝘄 𝗿𝗶𝗴𝗵𝘁" @click="nextPage" :disabled="isAtBottom"><span class="glyphicon glyphicon-step-forward"></span></button><button type="button" class="btn btn-default btn-xs" title="Go to bottom 𝗘𝗻𝗱" @click="bottom" :disabled="isAtBottom"><span class="glyphicon glyphicon-fast-forward"></span></button></div></div>',data:function(){return{scrolling:!1}},props:{progress:{type:Number,required:!0}},computed:{isAtTop:function(){return 0===this.progress},isAtBottom:function(){return 1===this.progress},progressHeight:function(){return 100*this.progress+"%"}},methods:{top:function(){this.$emit("top")},prevPage:function(){this.$emit("prev-page")},prevRow:function(){this.$emit("prev-row")},beginScrolling:function(){this.scrolling=!0},stopScrolling:function(){this.scrolling=!1},scroll:function(e){this.scrolling&&this.jump(e)},jump:function(e){var t=e.target.getBoundingClientRect();this.$emit("jump",(e.clientY-t.top)/t.height)},nextRow:function(){this.$emit("next-row")},nextPage:function(){this.$emit("next-page")},bottom:function(){this.$emit("bottom")}}}),biigle.$component("volumes.components.imageLabelList",{template:'<ul class="image-label-list"><list-item v-for="item in imageLabels" :item="item" :deletable="canDelete(item)" @deleted="emitDeleted"></list-item><li v-if="!hasImageLabels" class="text-muted">No image labels</li></ul>',components:{listItem:biigle.$require("volumes.components.imageLabelListItem")},props:{imageLabels:{type:Array,required:!0},userId:{type:Number,required:!0},isAdmin:{type:Boolean,default:!1}},computed:{hasImageLabels:function(){return this.imageLabels.length>0}},methods:{canDelete:function(e){return!0===this.isAdmin||this.userId===e.user.id},emitDeleted:function(e){this.$emit("deleted",e)}}}),biigle.$component("volumes.components.imageLabelListItem",{template:'<li class="image-label" :class="classObject"><span class="image-label__color" :style="colorStyle"></span><span v-text="label.name" :title="title"></span><button v-if="!deleting && deletable" class="close image-label__delete" :title="deleteTitle" @click.stop="deleteThis"><span aria-hidden="true">&times;</span></button></li>',props:{item:{type:Object,required:!0},deletable:{type:Boolean,default:!1}},data:function(){return{deleting:!1}},computed:{label:function(){return this.item.label},colorStyle:function(){return{"background-color":"#"+this.label.color}},deleteTitle:function(){return"Detach label "+this.label.name},title:function(){return"Attached by "+this.item.user.firstname+" "+this.item.user.lastname},classObject:function(){return{"image-label--deleting":this.deleting}}},methods:{deleteThis:function(){if(!this.deleting){var e=this;this.deleting=!0,biigle.$require("api.imageLabels").delete({id:this.item.id}).then(this.deleted,biigle.$require("messages.store").handleErrorResponse).finally(function(){e.deleting=!1})}},deleted:function(){this.$emit("deleted",this.item)}}}),biigle.$component("volumes.components.labelsTab",{mixins:[biigle.$require("core.mixins.loader")],components:{labelTrees:biigle.$require("labelTrees.components.labelTrees")},props:{volumeId:{type:Number,required:!0}},data:function(){return{labelTrees:biigle.$require("volumes.labelTrees")}},methods:{handleSelectedLabel:function(e){this.$emit("select",e)},handleDeselectedLabel:function(e){this.$emit("deselect",e)}}}),biigle.$component("volumes.components.sortingTab",{mixins:[biigle.$require("core.mixins.loader")],props:{volumeId:{type:Number,required:!0},imageIds:{type:Array,required:!0}},data:function(){return{sorters:biigle.$require("volumes.stores.sorters"),direction:!0,activeSorter:null,privateSequence:biigle.$require("volumes.imageIds")}},computed:{defaultSorter:function(){return this.sorters[0]},isActive:function(){return this.activeSorter!==this.defaultSorter.id||!this.direction},isSortedAscending:function(){return this.direction},isSortedDescending:function(){return!this.direction},sorterStorageKey:function(){return"biigle.volumes."+biigle.$require("volumes.volumeId")+".sorting2.sorter"},directionStorageKey:function(){return"biigle.volumes."+biigle.$require("volumes.volumeId")+".sorting2.direction"},sequence:function(){return this.direction?this.privateSequence:this.privateSequence.slice().reverse()}},methods:{reset:function(){this.direction=!0,this.activeSorter=this.defaultSorter.id,this.privateSequence=biigle.$require("volumes.imageIds")},sortAscending:function(){this.direction=!0},sortDescending:function(){this.direction=!1},handleSelect:function(e){if(!this.loading){var t=this;this.startLoading(),e.getSequence().then(function(i){t.activeSorter=e.id,t.privateSequence=i}).catch(biigle.$require("messages.store").handleErrorResponse).finally(this.finishLoading)}}},watch:{sequence:function(){this.$emit("update",this.sequence,this.isActive)},privateSequence:function(){this.activeSorter===this.defaultSorter.id?localStorage.removeItem(this.sorterStorageKey):localStorage.setItem(this.sorterStorageKey,JSON.stringify({id:this.activeSorter,sequence:this.privateSequence}))},direction:function(){this.direction?localStorage.removeItem(this.directionStorageKey):localStorage.setItem(this.directionStorageKey,this.direction)}},created:function(){var e=JSON.parse(localStorage.getItem(this.sorterStorageKey));e?(this.activeSorter=e.id,this.privateSequence=e.sequence):this.activeSorter=this.defaultSorter.id;var t=JSON.parse(localStorage.getItem(this.directionStorageKey));null!==t&&(this.direction=t)}}),biigle.$component("volumes.components.volumeImageGrid",{mixins:[biigle.$require("volumes.components.imageGrid")],template:'<div class="image-grid" @wheel.prevent="scroll"><div class="image-grid__images" ref="images"><image-grid-image v-for="image in displayedImages" :key="image.id" :image="image" :empty-url="emptyUrl" :selected-label="selectedLabel" :label-mode="labelMode" @select="emitSelect" @deselect="emitDeselect"></image-grid-image></div><image-grid-progress v-if="canScroll" :progress="progress" @top="jumpToStart" @prev-page="reversePage" @prev-row="reverseRow" @jump="jumpToPercent" @next-row="advanceRow" @next-page="advancePage" @bottom="jumpToEnd"></image-grid-progress></div>',components:{imageGridImage:biigle.$require("volumes.components.volumeImageGridImage")},props:{labelMode:{type:Boolean,default:!1},selectedLabel:{type:Object,default:null}}}),biigle.$component("volumes.components.volumeImageGridImage",{mixins:[biigle.$require("volumes.components.imageGridImage"),biigle.$require("core.mixins.loader")],
template:'<figure class="image-grid__image image-grid__image--volume" :class="classObject" :title="title"><a v-if="!labelMode && image.annotateUrl" :href="image.annotateUrl" title="Annotate this image" class="image-link"><img :src="url || emptyUrl" @error="showEmptyImage"></a><img v-else @click="handleClick" :src="url || emptyUrl" @error="showEmptyImage"><div class="image-buttons"><a v-if="image.imageUrl" :href="image.imageUrl" class="image-button" title="View image information"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span></a><button @click="toggleImageLabels" class="image-button" title="Show image labels"><loader v-if="!imageLabelsLoaded" :active="loading"></loader><span v-if="!loading" class="glyphicon glyphicon-tag" aria-hidden="true"></span></button></div><div v-if="imageLabelsLoaded && showImageLabels" class="image-labels" @wheel.stop><image-label-list :image-labels="imageLabels" :user-id="userId" :is-admin="isAdmin" @deleted="removeImageLabel"></image-label-list></div></figure>',components:{imageLabelList:biigle.$require("volumes.components.imageLabelList")},data:function(){return{showImageLabels:!1,imageLabels:[],imageLabelsLoaded:!1,attachingSuccess:null,timeout:null,saving:!1}},props:{selectedLabel:{type:Object,default:null},labelMode:{type:Boolean,default:!1}},computed:{userId:function(){return biigle.$require("volumes.userId")},isAdmin:function(){return biigle.$require("volumes.isAdmin")},alreadyHasSelectedLabel:function(){for(var e=this.imageLabels.length-1;e>=0;e--)if(this.imageLabels[e].label.id===this.selectedLabel.id)return!0;return!1},showAnnotationLink:function(){var e=biigle.$require("largo.showAnnotationRoute");return e?e+this.image.id:""},selected:function(){return this.image.flagged},selectable:function(){return this.labelMode&&this.selectedLabel&&!this.alreadyHasSelectedLabel&&!this.saving},classObject:function(){return{"image-grid__image--selected":this.selected,"image-grid__image--selectable":this.selectable,"image-grid__image--saving":this.labelMode&&this.saving,"image-grid__image--success":!0===this.attachingSuccess,"image-grid__image--error":!1===this.attachingSuccess}},title:function(){return this.selectable?"Attach "+this.selectedLabel.name:""}},methods:{toggleImageLabels:function(){this.showImageLabels=!this.showImageLabels,this.imageLabelsLoaded||this.loading||this.loadImageLabels()},loadImageLabels:function(){this.startLoading(),biigle.$require("api.imageLabels").query({image_id:this.image.id}).then(this.loadedImageLabels,biigle.$require("messages.store").handleErrorResponse).finally(this.finishLoading)},loadedImageLabels:function(e){this.imageLabelsLoaded=!0,this.imageLabels=e.data},handleClick:function(){if(this.selectable){var e=this;this.saving=!0,biigle.$require("api.imageLabels").save({image_id:this.image.id},{label_id:this.selectedLabel.id}).then(this.labelAttached,this.attachingFailed).finally(this.resetSuccess).finally(function(){e.saving=!1})}},labelAttached:function(e){this.attachingSuccess=!0,this.imageLabels.push(e.data)},attachingFailed:function(e){this.attachingSuccess=!1,biigle.$require("messages.store").handleErrorResponse(e)},resetSuccess:function(){var e=this;clearTimeout(this.timeout),this.timeout=setTimeout(function(){e.attachingSuccess=null},3e3)},removeImageLabel:function(e){for(var t=this.imageLabels.length-1;t>=0;t--)if(this.imageLabels[t].id===e.id)return void this.imageLabels.splice(t,1)}}}),biigle.$component("volumes.mixins.sortComponent",{template:'<button class="list-group-item" :title="title" @click="handleClick" :class="classObject" v-text="text"></button>',props:{activeSorter:{type:String,default:""}},computed:{active:function(){return this.activeSorter===this.id},classObject:function(){return{active:this.active}}},methods:{getSequence:function(){return new Vue.Promise(function(e){e([])})},handleClick:function(){this.active||this.$emit("select",this)}}}),biigle.$declare("volumes.stores.filters",[{id:"imageLabels",label:"image labels",help:"All images that (don't) have image labels attached.",listComponent:{mixins:[biigle.$require("volumes.components.filterListComponent")],data:function(){return{name:"image labels"}}},getSequence:function(e){return biigle.$require("api.volumes").queryImagesWithImageLabels({id:e})}},{id:"imageLabel",label:"image label",help:"All images that (don't) have the given image label attached.",listComponent:{mixins:[biigle.$require("volumes.components.filterListComponent")],data:function(){return{name:"image label"}}},selectComponent:{mixins:[biigle.$require("volumes.components.filterSelectComponent")],data:function(){return{placeholder:"Label name"}},created:function(){biigle.$require("api.volumes").queryImageLabels({id:this.volumeId}).then(this.gotItems,biigle.$require("messages.store").handleErrorResponse)}},getSequence:function(e,t){return biigle.$require("api.volumes").queryImagesWithImageLabel({id:e,label_id:t.id})}},{id:"imageLabelUser",label:"image label from user",help:"All images that (don't) have one or more image labels attached by the given user.",listComponent:{mixins:[biigle.$require("volumes.components.filterListComponent")],data:function(){return{name:"image label from user"}}},selectComponent:{mixins:[biigle.$require("volumes.components.filterSelectComponent")],data:function(){return{placeholder:"User name"}},created:function(){biigle.$require("api.volumes").queryUsers({id:this.volumeId}).then(this.parseUsernames,biigle.$require("messages.store").handleErrorResponse).then(this.gotItems)}},getSequence:function(e,t){return biigle.$require("api.volumes").queryImagesWithImageLabelFromUser({id:e,user_id:t.id})}},{id:"filename",label:"filename",help:"All images that (don't) have a filename matching the given pattern. A pattern may contain the wildcard character * that matches any string of zero or more characters.",listComponent:{mixins:[biigle.$require("volumes.components.filterListComponent")],computed:{dataName:function(){return this.rule.data}}},selectComponent:{template:'<div class="filter-select"><div class="typeahead"><input class="form-control" type="text" v-model="selectedItem" placeholder="Filename pattern"></div><button type="submit" class="btn btn-default" @click="submit" :disabled="!selectedItem">Add rule</button></div>',mixins:[biigle.$require("volumes.components.filterSelectComponent")]},getSequence:function(e,t){return biigle.$require("api.volumes").queryImagesWithFilename({id:e,pattern:t})}}]),biigle.$declare("volumes.stores.sorters",[{id:"filename",component:{mixins:[biigle.$require("volumes.mixins.sortComponent")],data:function(){return{title:"Sort images by filename",text:"Filename",id:"filename"}},methods:{getSequence:function(){return new Vue.Promise(function(e){e(biigle.$require("volumes.imageIds"))})}}}},{id:"random",component:{mixins:[biigle.$require("volumes.mixins.sortComponent")],data:function(){return{title:"Sort images randomly",text:"Random",id:"random"}},methods:{shuffle:function(e){var t,i,s;for(t=e.length-1;t>0;t--)i=Math.floor(Math.random()*(t+1)),s=e[t],e[t]=e[i],e[i]=s;return e},getSequence:function(){var e=this.shuffle(biigle.$require("volumes.imageIds").slice());return new Vue.Promise(function(t){t(e)})},handleClick:function(){this.$emit("select",this)}}}}]);