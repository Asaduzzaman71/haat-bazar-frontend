import DashBoard from './pages/DashbBoard.vue';
import LibraryMember from './pages/Member.vue';
import IssueBook from './pages/Issue.vue';
import LoginPage from  './pages/Login.vue';
import SignUp from './pages/SignUp.vue';
import CategoryIndex from './pages/Category.vue';
import ProductPage from './pages/Product.vue';

function guardMyroute(to, from, next){
    var isAuthenticated= false;
    const token = localStorage.getItem('access-token');
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    var expiaryTime = JSON.parse(jsonPayload);
    if( localStorage.getItem('access-token') && ( expiaryTime.exp < Date.now() ) ){
        isAuthenticated = true;
    }
    isAuthenticated ?  next() : next('/login');
}

export const routes = [
    {
        path: '/login',
        name: 'login',
        component: LoginPage,
    },
    {
        path: '/signup',
        name: 'signup',
        component: SignUp,
    },
    {
        name: 'dashboard',
        path: '/',
        beforeEnter : guardMyroute,
        component: DashBoard
    },
    {
        name: 'categories',
        path: '/categories',
        beforeEnter : guardMyroute,
        component: CategoryIndex
    },
    {
        name: 'products',
        path: '/products',
        beforeEnter : guardMyroute,
        component: ProductPage
    },
    {
        name: 'member',
        path: '/members',
        beforeEnter : guardMyroute,
        component: LibraryMember
    },
    {
        name: 'issues',
        path: '/issues',
        beforeEnter : guardMyroute,
        component: IssueBook
    },
];
