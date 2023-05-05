<template lang="pug">
.content
  .flex
    input.input-query(v-model="inputQuery" type="string" placeholder="2 btc in usd")
    button.btn-convert(@click="convert(inputQuery)") Convert
  p.p-total {{ total }}
</template>

<script>
export default {
  data: () => ({
    coin: "",
    fiat: "",
    price: null,
    amount: null,
    inputQuery: "",
    cacheLifeTime: 120000,
    cache:{},
    error:null
  }),
  computed: {
    total() {
      if (this.coin || this.price) {
        return (
          this.numberWithSpace((this.price * this.amount).toFixed(2)) +
          " " +
          this.fiat +
          " for " +
          this.amount +
          " " +
          this.coin
        );
      } else {
        return "Enter amount";
      }
    },
  },
  methods: {
    getCoinPrice(coin, fiat) {
      //для переиспользования этой функции, можно подать на вход свои монеты, а можно запустить без аргументов
      //можно было бы указать прям в аргументах coin=this.coin, но на прошлом проекте было принято так
      coin ??= this.coin;
      fiat ??= this.fiat;
      if (this.cache[coin]?.[fiat]?.cacheTime && (Date.now() - this.cache[coin]?.[fiat]?.cacheTime) < this.cacheLifeTime) {
        this.price=this.cache[coin][fiat].price
        return;
      } else {
        this.error=null
        fetch(
          `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coin}&tsyms=${fiat}&api_key=b5a5b68758c1e3428691ea0f0fcac1dfe98df8c99dba00cfac673e16b887c436`
        )
          .catch(error=>this.error=error)
          .then((res) => res.json())
          .then((json) => {
            this.price = +json[coin][fiat];
            this.cache[coin] ?? (this.cache[coin]={})
            this.cache[coin][fiat]={cacheTime:Date.now(),price:this.price}
          });
      }
    },
    matchInputQuery(inputQuery) {
      inputQuery ??= this.inputQuery;
      const input = inputQuery.split(" ");
      this.amount = input[0];
      this.coin = input[1].toUpperCase();
      //чтобы избежать лишних слов или если указан ввод без предлога
      this.fiat = input.at(-1).toUpperCase();
    },
    convert(inputQuery) {
      this.matchInputQuery(inputQuery);
      this.getCoinPrice();
    },
    numberWithSpace(number) {
      //разделитель разрядов
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
  },
  created(){
  }
};
</script>

<style>
.content {
  @apply w-[90vw] sm:w-[400px];
}
.btn-convert {
  @apply bg-green-500 rounded-r px-4 py-2;
}
.input-query {
  @apply grow rounded-l pl-1 appearance-none;
}
.p-total {
  @apply py-2 mt-2 bg-white text-center font-bold rounded;
}
</style>
