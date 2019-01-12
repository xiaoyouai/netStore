<!-- GoodList.vue-->
<template>
<div>
<nav-header></nav-header>
<nav-bread><span>Goods</span></nav-bread>
<div class="accessory-result-page accessory-page">
  <div class="container">
    <div class="filter-nav">
      <span class="sortby">Sort by:</span>
      <a href="javascript:void(0)" class="default cur">Default</a>
      <a href="javascript:void(0)" class="price" @click="sortGoods" :class="{'sort-up':!sortFlag}">Price
           <svg class="icon icon-arrow-short"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-arrow-short"></use></svg>
      </a>
      <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop" >Filter by</a>
    </div>
    <div class="accessory-result">
      <!-- filter -->
      <div class="filter stopPop" id="filter" :class="{'filterby-show':filterBy}">
        <dl class="filter-price">
          <dt>Price:</dt>
          <dd>
              <a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}" @click="priceChecked='all'">All</a>
          </dd>
          <dd v-for="( price,index ) in priceFilter" @click="priceChecked=index">
            <a href="javascript:void(0)" @click=" setPriceFilter(index)" :class="{'cur':priceChecked==index}">{{price.startPrice}} - {{price.endPrice}}</a>
          </dd>
        </dl>
      </div>

      <!-- search result accessories list -->
      <div class="accessory-list-wrap">
        <div class="accessory-list col-4">
          <ul>
            <li v-for="item in goodList">
              <div class="pic">
                <a href="#"><img v-lazy="'./../../static/img/'+item.productImage" alt=""></a>
              </div>
              <div class="main">
                <div class="name">{{item.productName}}</div>
                <div class="price">{{item.salePrice}}</div>
                <div class="btn-area">
                  <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                </div>
              </div>
            </li>
          </ul>
          <div class="loadmore" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
             <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading"></div>
        </div>
      </div>
    </div>
  </div>
</div>
<modal v-on:close="closeModal" v-bind:mdShow="mdShow">
    <p slot="message">
        请先登录，否则无法加入购物车中！
    </p>
    <div slot="btnGroup">
        <a  class="btn btn-m" href="javascript:void(0)" @click="mdShow=false">关闭</a>
    </div>
</modal>
<modal v-on:close="closeModal" v-bind:mdShow="mdShowCart">
    <p slot="message">
            <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成功!</span>
    </p>
    <div slot="btnGroup">
        <a  class="btn btn-m" href="javascript:void(0)" @click="mdShowCart=false">继续购物</a>
        <router-link class="btn btn-m" href="javascript:void(0)" to="/cart">查看购物车</router-link>
    </div>
</modal>
<div class="md-overlay" v-show="overLayFlag" @click.stop="closePop"></div>
<nav-footer></nav-footer>
</div>
</template>
<style>
.btn:hover{
    background-color: #ffe5e6;
    transition:all .3s ease-out;
}
.sort-up{
    transform:rotate(180deg);
    transition:all .3s ease-out;
}
</style>
<script>
import './../assets/css/base.css'
import './../assets/css/product.css'
import NavHeader from '@/components/NavHeader.vue'
import NavFooter from '@/components/NavFooter.vue'
import NavBread from '@/components/NavBread.vue'
import Modal from '@/components/Modal.vue'
import axios from 'axios'

export default{
    data(){
        return{
            goodList:[],
            loading:false,
            mdShow:false,
            mdShowCart:false,
            priceFilter:[
                {
                    startPrice:'0,00',
                    endPrice:'100.00'
                },
                {
                    startPrice:'100,00',
                    endPrice:'500.00'
                },
                {
                    startPrice:'500,00',
                    endPrice:'1000.00'
                },
                {
                    startPrice:'1000,00',
                    endPrice:'5000.00'
                }
            ],
            priceChecked:'all',
            filterBy:false,
            overLayFlag:false,
            sortFlag:true,
            page:1,
            pageSize:8,
            busy:true,

    }},
    components:{
        NavHeader,
        NavFooter,
        NavBread,
        Modal
    },
    mounted() {
        this.getGoodsList();
    },
    methods:{
        getGoodsList(flag){
            let param={
                page:this.page,
                pageSize:this.pageSize,
                sort:this.sortFlag?1:-1,
                priceLevel:this.priceChecked
            }
            this.loading=true;//下拉刷新的加载动图显示出来
            axios.get('/goods/list',{
                params:param
            }).then((res)=>{
                var data=res.data;
                this.loading=false;//下拉刷新的加载动图显示出来
               if(data.status=='0'){
                   if(flag){
                        this.goodList=this.goodList.concat(data.result.list);//实现累加
                        if(data.result.count==0){//说明没有数据了
                            this.busy=true;//禁用滚动
                        }else{
                            this.busy=false;
                        }
                   }else{
                        this.goodList=data.result.list;
                            this.busy=false;
                   }
               }else{
                  this.goodList=[]
               };
            })
        },
        sortGoods(){
            this.sortFlag=!this.sortFlag;
            this.page=1;
            this.getGoodsList();
        },
        showFilterPop(){
            this.filterBy=true;
            this.overLayFlag=true;
        },
        setPriceFilter(index){
            this.priceChecked=index;
            this.closePop();
            this.page=1;
            this.getGoodsList();
        },
        closePop(){
            this.filterBy=false;
            this.overLayFlag=false;
        },
        loadMore() {//实现滚动加载
            this.busy = true;
            setTimeout(() => {
                    this.page++;
                    this.getGoodsList(true);
                    this.busy = false;
            }, 500);
        },
        addCart(productId){
            axios.post("/goods/addCart",{
                productId:productId
            }).then((res)=>{
                if(res.data.status=='0'){
                    this.mdShowCart=true;
                     this.$store.commit("updateCartCount",1);
                }else{
                    this.mdShow=true;
                }
            })
        },
        closeModal(){
            this.mdShow=false;
            this.mdShowCart=false;
        }

    }
}
</script>