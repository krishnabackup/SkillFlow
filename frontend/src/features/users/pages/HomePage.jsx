import Navbar from "../../../components/NavBar";
import GoalsTextArea from "../components/GoalsTextArea";
export default function HomePage() {
    
    return(
        <>
        <Navbar/>
        <div className="flex justify-center items-center mt-10">
          <GoalsTextArea/>
        </div>
        </>
    )
}