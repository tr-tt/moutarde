import './index.css'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

console.log('index!');