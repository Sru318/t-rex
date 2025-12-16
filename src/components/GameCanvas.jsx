import dino from "../assets/images/trex.png"
import ground from "../assets/images/ground.png"
import cacti from "../assets/images/cactus_1.png"
import { ref, push } from "firebase/database";
import { db } from "../firebase";
import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"


function GameCanvas() {

    let navigate = useNavigate()
    let [cactus, setCactus] = useState([]);
    let [isStart, setStart] = useState(false);
    let [isJump, setJump] = useState(false);
    let [score, setScore] = useState(0);
    let [status, setStatus] = useState(false);
    let scoreCactusRef = useRef(new Set());


    let dinoRef = useRef();
    let cactusRef = useRef([]);

    let location = useLocation();
    let userName = location.state?.username || "Guest";


    function handleStart() {

        setStart(prev => !prev)
        setStatus(false)
        setJump(false)
        setCactus([])
        scoreCactusRef.current.clear();
        setScore(0);
    }

    function handleJump() {
        if (!isJump && isStart) {
            setJump(true)
        }
        setTimeout(() => {
            setJump(false)
        }, 500);

    }

    function handleSaveScore() {

        let playerData = ref(db, "userScore");

        push(playerData, {
            name: userName,
            score: score
        });

        setStatus(false);
        setStart(false);
        setScore(0);
        scoreCactusRef.current.clear();
        setCactus([]);

    }

    useEffect(() => {

        let interval;
        if (isStart) {

            let spawnCactus = () => {
                setCactus(prev => [...prev, { image: cacti, pos: 800 }])
            }
            interval = setInterval(spawnCactus, 3000);
        }
        return () => clearInterval(interval);

    },);


    useEffect(() => {

        if (!isStart) return;
        let animationId;

        let checkCollision = () => {

            let dinoRect = dinoRef.current.getBoundingClientRect()
            if (!dinoRect) return;
            cactusRef.current.forEach(cactusEl => {

                if (!cactusEl) return;
                let cactusRect = cactusEl.getBoundingClientRect();

                if (dinoRect.right > cactusRect.left &&
                    dinoRect.left < cactusRect.right &&
                    dinoRect.bottom > cactusRect.top &&
                    dinoRect.top < cactusRect.bottom
                ) {
                    setStart(false);
                    setStatus(true);
                    return;
                }
                if (
                    cactusRect.right < dinoRect.left &&
                    !scoreCactusRef.current.has(cactusEl)

                ) {
                    setScore(prev => prev + 1);
                    scoreCactusRef.current.add(cactusEl);

                }
            });

            animationId = requestAnimationFrame(checkCollision);
        }
        animationId = requestAnimationFrame(checkCollision);

        return () => cancelAnimationFrame(animationId);

    }, [isStart]);
    

    useEffect(() => {

        let handleKeyDown = (e) => {
            if (e.code === "Space") {
                e.preventDefault();
                handleJump()
            }
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }

    }, [isJump,isStart]);

    return (
        <>

            <div className=" w-full max-w-[800px] h-[220px] sm:h-[260px] md:h-[300px] mx-auto my-10 sm:my-20 relative border rounded-xl overflow-hidden">
                <img src={dino} ref={dinoRef} className={`absolute bottom-[72px] sm:bottom-[75px] left-20 w-[50px] ${isJump ? 'animate-jump' : ''}`} alt="" />
                {cactus.map((cactus, id) => (
                    <div className={`absolute sm:bottom-[88px] md:bottom-[80px] bottom-[77px] ${isStart ? 'animate-cactus' : ''}`}>
                        <img key={id} src={cactus.image} ref={el => (cactusRef.current[id] = el)} className="  h-[55px] object-cover" alt="Cactus" />
                    </div>
                ))}
                <div className={`absolute bottom-20  w-max flex ${isStart ? 'animate-ground' : ''}`}>
                    <img src={ground} className="w-screen" alt="ground" />
                    <img src={ground} className="w-screen" alt="ground" />
                </div>
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-sm sm:text-xl font-mono">Score: {score}</div>
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 text-sm sm:text-xl font-mono">Player: {userName}</div>
            </div>
            <div className='max-w-80 mx-auto flex flex-col gap-3 items-center sm:flex-row sm-:gap-5'>
                <button onClick={handleStart} className="border px-6 py-3 text-white bg-blue-500 font-bold rounded-lg ">{isStart ? "Pause " : "Start"}</button>
                <button onClick={handleJump} className="border px-6 py-3 text-white bg-red-500 font-bold rounded-lg ">Jump</button>
                <button onClick={() => { navigate('/') }} className="border px-6 py-3 text-white bg-green-500 font-bold rounded-lg ">Quit</button>
            </div>

            {
                status && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4" >
                        <div className="bg-white rounded-xl p-5 sm:p-6  max-w-[300px] text-center shadow-lg">
                            <h2 className="text-xl sm:text-2xl font-bold text-red-600">Game Over</h2>
                            <p className="mt-3 text-gray-700 text-sm sm:text-base">
                                Your Score: <span className="font-semibold">{score}</span>
                            </p>
                            <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <button onClick={handleStart} className="w-full sm:w-auto border px-6 py-3 sm:py-2 text-white bg-blue-500 font-bold rounded-lg ">Restart</button>
                                <button onClick={handleSaveScore} className="w-full sm:w-auto border px-6 py-3 sm:py-2 text-white bg-black font-bold rounded-lg">Save</button>
                            </div>
                        </div>


                    </div>
                )
            }


        </>
    )
}

export default GameCanvas
