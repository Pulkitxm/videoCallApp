const Home = () => {
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const vales = {
      roomID: e.target.roomID.value,
    };
    console.log(vales);
  };
  return (
    <main className="h-screen w-screen bg-gray-950 text-white flex justify-center items-center">
      <form
        className="card w-[90%] md:w-[70%] lg:w-[50%] max-w-[700px] h-[50%] rounded-lg bg-gray-700 flex justify-center items-center flex-col "
        onSubmit={handleFormSubmit}
      >
        <label
          htmlFor="roomID"
          className="text-4xl text-gray-300 cursor-pointer m-2 mb-12"
        >
          Video Call: Pulkit
        </label>
        <label
          htmlFor="roomID"
          className="text-2xl text-gray-300 cursor-pointer m-2"
        >
          Enter Room Id
        </label>
        <input
          type="text"
          required
          id="roomID"
          placeholder="Start Typing here"
          className="bg-transparent m-2 outline-none border-b-2 border-gray-300 text-white text-2xl w-[70%] sm:w-[30%] md:w-[40%] text-center p-2"
        />
        <button 
          type="submit" 
          className="w-[50%] sm:w-[30%] md:w-[20%] bg-gray-300 text-gray-900 p-2 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-gray-900 transition-all duration-300 ease-in-out m-8 mb-0 select-none"
        >
          Submit
        </button>
      </form>
    </main>
  );
};

export default Home;
