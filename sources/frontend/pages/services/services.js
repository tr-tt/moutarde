import './services.css'

if(process.env.NODE_ENV === 'development' && module.hot)
{
    module.hot.accept()
}

console.log('services');