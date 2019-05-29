import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'mainpage',
            redirect:{name:'dbconvert'},
            component: require('@/components/mainPage.vue').default,
            children: [
                {
                    path: 'dbconvert',
                    name:'dbconvert',
                    component: require('@/components/routercom/dbconvertcom.vue').default
                },
                {
                    path: 'createdb',
                    name:'createdb',
                    component: require('@/components/routercom/createdbcom.vue').default
                },
                {
                    path: 'other',
                    name:'other',
                    component: require('@/components/routercom/othercom.vue').default
                },
                {
                    path: 'downfile',
                    name:'downfile',
                    component: require('@/components/routercom/downfilecom.vue').default
                }
            ]
        },
        {
            path: '*',
            redirect:
                '/'
        }
    ]
})
