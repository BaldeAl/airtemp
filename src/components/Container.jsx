import Search from "./Search";
import Places from "./place/Places";

const Container = () => {
    return ( 
        <div className='flex min-h-[calc(100vh-100px)] flex-col items-center'>
            <Search/>
            <Places/>

        </div>
     );
}
 
export default Container;