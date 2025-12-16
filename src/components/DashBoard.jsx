import dino from "../assets/images/dinogame.jpg"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react'
import { ref,push, onValue } from "firebase/database";
import { db } from "../firebase";
function DashBoard() {

    let [user, setUserName] = useState('');
    let [error, setError] = useState('')
    let navigate = useNavigate()
    const [score, setScores] = useState([]);


    function handleSubmit(e) {
        e.preventDefault();
        setError('')
        if (!user) {
            setError("Please enter userName to play")
            return
        }
        let usersRef = ref(db, "users");
        push(usersRef, {
            username: user,
        });
        
        navigate('/gamecanvas', {
            state: { username: user }
        })
    }

    useEffect(() => {

        let dataRef = ref(db, "userScore");
        let handleData = (snapshot) => {
            let data = snapshot.val();
            if (!data) {
                setScores([]);
                return;
            }
            let scoresArray = Object.values(data).filter(item => item.score !== 0).sort((a,b)=>b.score-a.score);
            setScores(scoresArray.slice(0, 5));
            
        };
        onValue(dataRef, handleData);

    }, []);

    return (
        <>

            <div className="mx-auto my-20 max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
                <div className="md:flex">
                    <div className="md:shrink-0">
                        <img className="h-full w-full object-cover md:h-full md:w-48 " src={dino} />
                    </div>
                    <div className="p-8">
                        <div className="text-lg font-semibold tracking-wide text-indigo-500 uppercase">Play Game</div>
                        <div className="mt-7 ">
                            {error && <div className="text-red-500 text-sm mb-4 p-2 bg-red-100 rounded border border-red-400">{error}</div>}
                            <form className='flex flex-col gap-5 items-center' onSubmit={handleSubmit}>
                                <input type="text"
                                    value={user}
                                    placeholder="Enter username"
                                    className="w-full px-3 py-2 outline-none rounded-xl border md:w-full lg:w-48"
                                    onChange={(e) => { setUserName(e.target.value) }}
                                />
                                <button className="w-full px-4 py-2 bg-blue-500 text-white rounded text-center" type="submit">Start Game</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mx-auto my-3 max-w-md overflow-hidden rounded-xl bg-white shadow-md md:max-w-2xl">
                <div className="md:flex">
                    <div className="p-8">
                        <div className="text-lg font-semibold tracking-wide text-indigo-500 uppercase">Leadership Board</div>
                        <div className="mt-4">
                            {score.map((user,id) => (
                                <div key={id} className="flex justify-between items-center py-2 border-b">
                                    <span className="font-medium text-indigo-600 ">
                                        {user.name}
                                    </span>
                                    <span className="font-bold text-indigo-600">
                                        {user.score }
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashBoard
