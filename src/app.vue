<template>
    <div id="app">
        <div id="cover"></div>
        <Header></Header>
        <Todo></Todo>
        <Footer></Footer>
    </div>
</template>

<script>
import Header from './todo/header.vue';
import Footer from './todo/footer.jsx';
import Todo from './todo/todo.vue';
export default {
    data() {
        return {
            text: 'wwww'
        }
    },
    components:{
        Header,
        Footer,
        Todo
    }
 }
</script>

<style scoped>
    #app{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top:0;

    }
    #cover{
        position: absolute;
        background: #999;
        left: 0;
        right: 0;
        bottom: 0;
        top:0;
        opacity: .9;
        z-index: -1;
    }
</style>

