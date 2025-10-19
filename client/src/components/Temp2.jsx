import React, { useState, useEffect, useContext, useRef } from "react";
import { BsThreeDotsVertical, BsEmojiSmile, BsPaperclip, BsSend, BsCircleFill, BsTelephone, BsCameraVideo } from "react-icons/bs";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const WhatsAppClone = () => {

    const { backendURL, userData, getUserData } = useContext(AppContext);
    const modal = useRef(null);
    const gmodal = useRef(null);
    const detmodal = useRef(null);
    const addToGroup = useRef(null);
    const addToGroupList = useRef(null);

    const [selectedChat, setSelectedChat] = useState(null);
    const [selectedChatDetails, setSelectedChatDetails] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [addUser, setAddUser] = useState(" ");
    const [addUserList, setAddUserList] = useState([]);
    const [newGroup, setNewGroup] = useState("");
    const [selectedChatName, setSelectedChatName] = useState("");
    //const [filteredContacts, setFilteredContacts] = useState([]);


    const [addingGroupMember, setAddingGroupMember] = useState([]);

    const [chats, setChats] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    const mockContacts = [
        {
            id: 1,
            name: "John Doe",
            avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d",
            lastMessage: "Hey, how are you?",
            timestamp: "10:30 AM",
            unreadCount: 2,
            online: true
        },
        {
            id: 2,
            name: "Jane Smith",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
            lastMessage: "See you tomorrow!",
            timestamp: "9:45 AM",
            unreadCount: 0,
            online: false
        }
    ];

    const mockMessages = {
        1: [
            { id: 1, text: "Hey, how are you?", sender: "them", timestamp: "10:30 AM" },
            { id: 2, text: "I'm good, thanks!", sender: "me", timestamp: "10:31 AM" },
            { id: 3, text: "What's up?", sender: "them", timestamp: "10:32 AM" }
        ],
        2: [
            { id: 1, text: "Meeting at 2?", sender: "them", timestamp: "9:45 AM" },
            { id: 2, text: "Yes, see you there!", sender: "me", timestamp: "9:46 AM" },
            { id: 3, text: "See you tomorrow!", sender: "them", timestamp: "9:47 AM" }
        ]
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedChat) return;

        const newMsg = {
            id: messages[selectedChat].length + 1,
            text: newMessage,
            sender: "me",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        };

        setMessages(prev => ({
            ...prev,
            [selectedChat]: [...prev[selectedChat], newMsg]
        }));
        setNewMessage("");
    };

    const getPic = (chatId) => {
        if (!userData) return;
        if (chats.find(chat => chat._id === chatId).isGroupChat) {
            return 'group.png';
        }
        return chats.find(chat => chat._id === chatId).users.find(user => user.name !== userData.name).profilePic;
    }

    const getName = (chatId) => {
        if (!userData) return;

        return chats.find(chat => chat._id === chatId).isGroupChat ? chats.find(chat => chat._id === chatId).chatName : chats.find(chat => chat._id === chatId).users.find(user => user.name !== userData.name).name;
    }

    const getLastMessage = (chatId) => {

        if (chats.find(chat => chat._id === chatId).latestMessage) {
            return chats.find(chat => chat._id === chatId).latestMessage.content;
        }
    }

    const contactClickHandler = (chatId) => {
        setSelectedChat(chatId);
        setSelectedChatDetails(chats.find(chat => chat._id === chatId));
        setSelectedChatName(getName(chatId));

        console.log(selectedChatDetails);
        // try {
        //     const { data } = await axios.get(backendURL + '/api/message/' + chatId)
        //     if(data.success){

        //     }else{
        //         toast.error(data.message);
        //     }
        //     console.log(data);
        // } catch (error) {
        //     toast.error(error.message);
        // }

    }

    const toggleAddModal = async () => {
        modal.current.classList.toggle('hidden');
        setAllUsers([]);
        setAddUser("");
        setAddUserList([]);
    }

    const toggleGroupModal = async () => {
        gmodal.current.classList.toggle('hidden');
        setAllUsers([]);
        setAddUser("");
        setAddUserList([]);
        setNewGroup("");
        setAddingGroupMember([]);
    }

    const updateAddingGroupMember = async (userId) => {
        console.log("here");
        setAddingGroupMember(m => [...m, userId]);
    }

    const removeFromGroupAddList = (userId) => {
        setAddingGroupMember(addingGroupMember.filter(user => user !== userId));
    }

    const setNameForSelectedUser = (userId) => {
        return allUsers.find(user => user._id === userId).name;
    }

    const removeFromGroup = async (userId) => {

        if (selectedChatDetails.groupAdmin._id !== userData._id) {
            console.log(selectedChatDetails.groupAdmin._id + " " + userData._id);
            toast.error("You are not the admin of the group");
            return
        }

        const chatId = selectedChat;
        if (userId === userData._id) {
            setSelectedChat(null);
            setSelectedChatDetails(null);
            selectedChatName("");
        }
        try {

            const { data } = await axios.put(backendURL + '/api/chat/groupremove', {
                chatId,
                addId: userId
            })

            if (data.success) {
                console.log(data.message);
                await fetchChats();
                if (userId !== userData._id) {
                    console.log("Hrer" + userId);
                    setSelectedChatDetails(data.message);
                }
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    const addGroup = async () => {
        try {
            const { data } = await axios.post(backendURL + '/api/chat/group', {
                users: JSON.stringify(addingGroupMember),
                name: newGroup
            })
            if (data.success) {
                console.log(data.message);
                toggleGroupModal();
                await fetchChats();
                setAddingGroupMember([]);
                //await contactClickHandler(data.message._id);

            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const updateGroupAddList = async (e) => {
        setAddUser(e.target.value);
        if (allUsers.length == 0) {
            const { data } = await axios.get(backendURL + '/api/user/all')
            console.log(data);
            setAllUsers(data.users);
        }

        setAddUserList(allUsers.filter(user => user.name.toLowerCase().includes(addUser.toLowerCase())));
    }

    const updateAddList = async (e) => {
        const tem = e.target.value;
        setAddUser(tem);
        if (allUsers.length == 0) {
            const { data } = await axios.get(backendURL + '/api/user/all')
            console.log(data);
            setAllUsers(data.users);
        }

        setAddUserList(allUsers.filter(user => user.name.toLowerCase().includes(tem.toLowerCase())));

    }

    const addChatClickHandler = async (recvId) => {
        try {
            const { data } = await axios.post(backendURL + '/api/chat/', {
                recvId
            })
            if (data.success) {
                console.log(data.message);
                toggleAddModal();
                await fetchChats();
                //contactClickHandler(data.message._id);
                // setSelectedChat(data.message._id);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const toggleChatDetails = () => {
        if (selectedChatDetails.isGroupChat) {
            detmodal.current.classList.toggle('hidden');
        }
    }

    const toggleAddToGroup = () => {
        addToGroup.current.classList.toggle('hidden');
        addToGroupList.current.classList.toggle('hidden');
    }

    const renameGroup = async () => {
        if (selectedChatName !== getName(selectedChat)) {
            try {
                const { data } = await axios.put(backendURL + '/api/chat/rename', {
                    chatId: selectedChat,
                    chatName: selectedChatName
                })
                if (data.success) {
                    console.log(data.message);
                    await fetchChats();
                    setSelectedChat(selectedChat);
                    setSelectedChatDetails(chats.find(chat => chat._id === selectedChat));
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        } else {
            toast.error("Name is same as before");
        }
    }
    const addMemberToExistingGroup = async (userId) => {

        if (selectedChatDetails.groupAdmin._id !== userData._id) {
            toast.error("You are not the admin of the group");
            return;
        }

        try {
            const { data } = await axios.put(backendURL + '/api/chat/groupadd', {
                chatId: selectedChat,
                addId: userId
            })

            if (data.success) {
                console.log(data.message);
                await fetchChats();
                setSelectedChatDetails(data.message);
            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    const fetchChats = async (req, res) => {
        try {
            const { data } = await axios.get(backendURL + '/api/chat/')
            if (data.success) {
                setChats(data.message);
                const x = data.message
                // setTimeout(() => {
                // setFilteredContacts(data.message.filter(chat => chat.users.length > 1 &&
                //     (chat.isGroupChat ? chat.chatName : ((chat.users[0].name !== userData.name) ? chat.users[0].name : chat.users[1].name))));
                // }, 1000);
            }
        } catch (error) {
            //console.log(error.message);
            toast.error(error.message)
        }

        //console.log(chats.filter(chat => chat.isGroupChat ? chat.chatName : ((chat.users[0].name !== userData.name) ? chat.users[0] : chat.users[1])));
    }

    useEffect(() => {

        fetchChats();

    }, []);

    // const filterContacts = (searchTerm) => {
    //     setSearchTerm(searchTerm);
    //     setFilteredContacts(chats.filter(chat =>
    //         (chat.isGroupChat ? chat.chatName : ((chat.users[0].name !== userData.name) ? chat.users[0].name : chat.users[1].name)).toLowerCase().includes(searchTerm.toLowerCase())))
    // }

    const filteredContacts = chats.filter(chat =>
        (chat.isGroupChat ? chat.chatName : ((chat.users[0].name !== userData.name) ? chat.users[0].name : chat.users[1].name)).toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex bg-gray-100 dark:bg-gray-900" style={{ height: "93%" }}>
            {/* Chat List */}
            <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                <div className="p-4 flex flex-row border-b border-gray-200 dark:border-gray-700 justify-evenly">
                    <input
                        type="text"
                        placeholder="Search chats..."
                        className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none basis-8/12"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {/* <button type="button" class=" ml-1 text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">New Chat</button> */}
                    <div class=" flex  text-slate-200 bg-blue-700 rounded-lg  justify-center items-center relative group basis-1/5">
                        Add
                        <div className='absolute bg-transparent pt-10 hidden group-hover:block top-0 right-0 z-10 text-slate-200 rounded bg-gray-900'>
                            <ul className='list-none m-0 p-2 bg-gray-700'>
                                <li className='py-1 px-2 cursor-pointer pr-14 hover:bg-gray-600' onClick={toggleAddModal}>Chat</li>
                                <li className='py-1 px-2 cursor-pointer pr-14 hover:bg-gray-600' onClick={toggleGroupModal}>Group</li>
                            </ul>
                        </div>
                    </div>
                </div>


                <div className="hidden absolute z-10 w-5/12  bg-transparent" ref={modal}>
                    <div class="relative p-4 w-full max-w-md max-h-full">
                        {/* <!-- Modal content --> */}
                        <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                            {/* <!-- Modal header --> */}
                            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                                <h5 class="text-xl font-semibold text-gray-900 dark:text-white">
                                    Add new chat
                                </h5>
                                <button type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={toggleAddModal}>
                                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span class="sr-only">Close modal</span>
                                </button>
                            </div>
                            {/* <!-- Modal body --> */}
                            <div class="p-4 md:p-5">
                                <div class="mb-4">
                                    <label for="name" class="block text-sm/6 font-medium text-gray-900 dark:text-white">User Name</label>
                                    <div class="mt-2">
                                        <input type="name" name="name" id="name" value={addUser} onChange={(e) => updateAddList(e)} placeholder='Enter user name' autocomplete="name" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 dark:bg-gray-800 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                                    </div>
                                </div>
                                <div className="overflow-y-auto h-56">
                                    {addUserList.map((contact) => (
                                        <div
                                            key={contact._id}
                                            onClick={() => addChatClickHandler(contact._id)}
                                            className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedChat === contact._id ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                                        >
                                            <img
                                                src={contact.profilePic}
                                                alt={contact.name}
                                                className="w-12 h-12 rounded-full"
                                            />
                                            <div className="ml-4 flex-1">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-semibold dark:text-white">{contact.name}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div class="flex justify-end">
                                    <button type="button" class="flex justify-center mt-4 rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hidden absolute z-10 w-5/12  bg-transparent" ref={gmodal}>
                    <div class="relative p-4 w-full max-w-md max-h-full">
                        {/* <!-- Modal content --> */}
                        <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                            {/* <!-- Modal header --> */}
                            <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                                <input type="name" name="name" id="name" value={newGroup} onChange={(e) => setNewGroup(e.target.value)} placeholder='GROUP NAME' autocomplete="name" required class="block w-4/5 rounded-md bg-white px-3 py-1.5 text-base text-gray-900 dark:bg-gray-800 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />

                                <button type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={toggleGroupModal}>
                                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                    </svg>
                                    <span class="sr-only">Close modal</span>
                                </button>
                            </div>
                            {/* <!-- Modal body --> */}
                            <div class="p-4 md:p-5">
                                <div class="mb-4">
                                    <label for="name" class="block text-sm/6 font-medium text-gray-900 dark:text-white">User Name</label>
                                    <div class="mt-2">
                                        <input type="name" name="name" id="name" value={addUser} onChange={(e) => updateGroupAddList(e)} placeholder='Enter user name' autocomplete="name" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 dark:bg-gray-800 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                                    </div>
                                </div>
                                <div className="flex flex-row">
                                    {
                                        addingGroupMember.map((member) => (
                                            <div key={member} className="bg-white rounded-lg p-1 me-1" onClick={() => removeFromGroupAddList(member)} >{setNameForSelectedUser(member)}</div>
                                        ))
                                    }
                                </div>
                                <div className="overflow-y-auto h-56">
                                    {addUserList.map((contact) => (
                                        <div
                                            key={contact._id}
                                            onClick={() => updateAddingGroupMember(contact._id)}
                                            className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedChat === contact._id ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                                        >
                                            <img
                                                src={contact.profilePic}
                                                alt={contact.name}
                                                className="w-12 h-12 rounded-full"
                                            />
                                            <div className="ml-4 flex-1">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="font-semibold dark:text-white">{contact.name}</h3>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div class="flex justify-end">
                                    <button type="button" onClick={() => addGroup()} class="flex justify-center mt-4 rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>







                <div className="overflow-y-auto h-[calc(100vh-5rem)]">
                    {filteredContacts.map((contact) => (
                        <div
                            key={contact._id}
                            onClick={() => contactClickHandler(contact._id)}
                            className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedChat === contact._id ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                        >
                            <img
                                src={getPic(contact._id)}
                                alt={getName(contact._id)}
                                className="w-12 h-12 rounded-full"
                            />
                            <div className="ml-4 flex-1">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold dark:text-white">{getName(contact._id)}</h3>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{contact.timestamp}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{getLastMessage(contact._id)}</p>
                                    {contact.unreadCount > 0 && (
                                        <span className="bg-green-500 text-white rounded-full px-2 py-1 text-xs">
                                            {contact.unreadCount}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>







            </div>

            {/* Chat Window */}
            {selectedChat ? (
                <div className="hidden md:flex flex-col w-2/3 bg-gray-50 dark:bg-gray-900">

                    <div className="hidden absolute z-10 w-1/2 translate-x-1/4 bg-transparent" ref={detmodal}>
                        <div class="relative p-4 w-full max-w-full max-h-full">
                            {/* <!-- Modal content --> */}
                            <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                                {/* <!-- Modal header --> */}
                                <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                                    <h5 class="text-xl font-semibold text-gray-900 dark:text-white">
                                        Group details
                                    </h5>
                                    <button type="button" class="end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" onClick={toggleChatDetails}>
                                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span class="sr-only">Close modal</span>
                                    </button>
                                </div>
                                {/* <!-- Modal body --> */}
                                <div class="p-4 md:p-5">
                                    <div class="mb-4 flex flex-row justify-around items-center">
                                        <label for="name" class="block text-sm/6 font-medium text-gray-900 dark:text-white">Group Name</label>
                                        <div class="mt-2 basis-7/12 ">
                                            <input type="name" name="name" id="name" value={selectedChatName} onChange={(e) => setSelectedChatName(e.target.value)} placeholder='Enter user name' autocomplete="name" required class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 dark:bg-gray-800 dark:text-white outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                                        </div>
                                        <button type="button" onClick={renameGroup} class="flex justify-center mt-2 rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Rename</button>
                                    </div>
                                    <div class="mb-4 flex flex-row justify-evenly items-center">
                                        <label for="name" class="block text-sm/6 font-medium text-gray-900 dark:text-white p-1">Members</label>
                                        <div class="mt-2 basis-3/4 flex flex-row items-center">
                                            {selectedChatDetails.users.map((user) => (
                                                <div key={user._id} className="text-white bg-gray-600 rounded-lg px-2 me-2" >{user.name}<span className="ms-1 text-xs hover:cursor-pointer" onClick={() => removeFromGroup(user._id)}>⨉</span></div>
                                            ))}
                                            <div>
                                                <input className="bg-gray-600 rounded-lg h-6 hidden px-2 me-2" type="text" name="" id="" value={addUser} onChange={(e) => updateAddList(e)} placeholder='Enter user name' ref={addToGroup} />
                                                <span className="text-white rounded-lg px-2 me-2 bg-gray-600 hover:cursor-pointer text-lg" onClick={toggleAddToGroup}>+</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div ref={addToGroupList} className="overflow-y-auto h-40 hidden">
                                        {addUserList.map((contact) => (
                                            <div
                                                key={contact._id}
                                                onClick={() => addMemberToExistingGroup(contact._id)}
                                                className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedChat === contact._id ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                                            >
                                                <img
                                                    src={contact.profilePic}
                                                    alt={contact.name}
                                                    className="w-12 h-12 rounded-full"
                                                />
                                                <div className="ml-4 flex-1">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="font-semibold dark:text-white">{contact.name}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* <div className="overflow-y-auto h-56">
                                        {addUserList.map((contact) => (
                                            <div
                                                key={contact._id}
                                                onClick={() => addChatClickHandler(contact._id)}
                                                className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedChat === contact._id ? "bg-gray-100 dark:bg-gray-700" : ""}`}
                                            >
                                                <img
                                                    src={contact.profilePic}
                                                    alt={contact.name}
                                                    className="w-12 h-12 rounded-full"
                                                />
                                                <div className="ml-4 flex-1">
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="font-semibold dark:text-white">{contact.name}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div> */}

                                </div>
                            </div>
                        </div>
                    </div>




                    <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                        <img
                            src={getPic(selectedChat)}
                            alt="Contact"
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="ml-4 flex-1">
                            <h3 onClick={toggleChatDetails} className="font-semibold dark:text-white">
                                {getName(selectedChat)}
                            </h3>
                            <div className="flex items-center">
                                <BsCircleFill className={`w-2 h-2 ${mockContacts.find(c => c.id === selectedChat)?.online ? "text-green-500" : "text-gray-500"}`} />
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                    {mockContacts.find(c => c.id === selectedChat)?.online ? "Online" : "Offline"}
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <BsTelephone className="w-5 h-5 text-gray-500 cursor-pointer" />
                            <BsCameraVideo className="w-5 h-5 text-gray-500 cursor-pointer" />
                            <BsThreeDotsVertical className="w-5 h-5 text-gray-500 cursor-pointer" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages[selectedChat]?.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[70%] p-3 rounded-lg ${message.sender === "me" ? "bg-green-500 text-white" : "bg-white dark:bg-gray-800 dark:text-white"}`}
                                >
                                    <p>{message.text}</p>
                                    <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-4">
                            <BsEmojiSmile className="w-6 h-6 text-gray-500 cursor-pointer" />
                            <BsPaperclip className="w-6 h-6 text-gray-500 cursor-pointer" />
                            <input
                                type="text"
                                placeholder="Type a message"
                                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 dark:text-white focus:outline-none"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            />
                            <BsSend
                                className="w-6 h-6 text-gray-500 cursor-pointer"
                                onClick={handleSendMessage}
                            />
                        </div>
                    </div>
                </div>


            ) : (
                <div className="hidden md:flex items-center justify-center w-2/3 bg-gray-50 dark:bg-gray-900 dark:text-white">
                    <p>Select a chat to start messaging</p>
                </div>
            )}





        </div>
    );
};

export default WhatsAppClone;