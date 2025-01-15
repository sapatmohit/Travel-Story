import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { MdAdd } from 'react-icons/md';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmptyCard from '../../components/Cards/EmptyCard';
import FilterInfoTitle from '../../components/Cards/FilterInfoTitle';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../utils/axiosInstance';
import { getEmptyCardImg, getEmptyCardMessage } from '../../utils/helper';
import AddEditTravelStory from './AddEditTravelStory';
import ViewTravelStory from './ViewTravelStory';

const Home = () => {
	const navigate = useNavigate();
	const [userInfo, setUserInfo] = useState(null);
	const [allStories, setAllStories] = useState([]);

	const [openAddEditModal, setOpenAddEditModal] = useState({
		isShown: false,
		type: 'add',
		data: null,
	});

	const [openViewModal, setOpenViewModal] = useState({
		isShown: false,
		data: null,
	});

	const [searchQuery, setSearchQuery] = useState('');

	const [filterType, setFilterType] = useState('');

	const [dateRange, setDateRange] = useState({ from: null, to: null });

	// Get the current user information
	const getUserInfo = async () => {
		try {
			const response = await axiosInstance.get('/get-user');
			if (response.data && response.data.user) {
				// Set user info if data exits
				setUserInfo(response.data.user);
			}
		} catch (error) {
			if (error.response.status === 401) {
				// Clear storage if unauthorized
				localStorage.clear();
				navigate('/login'); // Redirect to login page
			}
		}
	};

	// Get all travel stories
	const getAllTravelStories = async () => {
		try {
			const response = await axiosInstance.get('/get-all-stories');
			if (response.data && response.data.stories) {
				// Set all stories if data exits
				setAllStories(response.data.stories);
			}
		} catch (error) {
			console.log('An unexpected error occurred. Please try again');
		}
	};

	// Handle edit travel story
	const handelEdit = (data) => {
		setOpenAddEditModal({ isShown: true, type: 'edit', data: data });
	};

	// Handle view travel story
	const handleViewStory = (data) => {
		setOpenViewModal({ isShown: true, data });
	};

	// Handle toggle favourite status
	const handleFavouriteToggle = async (storyData) => {
		const storyId = storyData._id;
		try {
			const response = await axiosInstance.put(
				'/update-is-favourite/' + storyId,
				{
					isFavourite: !storyData.isFavourite,
				}
			);
			if (response.data && response.data.story) {
				toast.success('Story updated successfully');

				if (filterType === 'search' && searchQuery) {
					onSearchStory(searchQuery);
				} else if (filterType === 'date') {
					filterStoriesByDate(dateRange);
				} else {
					getAllTravelStories();
				}
			}
		} catch (error) {
			console.log('An unexpected error occurred. Please try again');
		}
	};

	// Delete Story
	const deleteTravelStory = async (data) => {
		const storyId = data._id;

		try {
			const response = await axiosInstance.delete('/delete-story/' + storyId);

			if (response.data && !response.data.error) {
				toast.error('Story Deleted Successfully');
				setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
				getAllTravelStories();
			}
		} catch (error) {
			// Handle unexpected error
			console.log('An unexpected error occurred. Please try again');
		}
	};

	// Search Story
	const onSearchStory = async (query) => {
		try {
			const response = await axiosInstance.get('/search', {
				params: { query },
			});

			if (response.data && response.data.stories) {
				// Set all stories if data exits
				setFilterType('search');
				setAllStories(response.data.stories);
			}
		} catch (error) {
			console.log('An unexpected error occurred. Please try again');
		}
	};

	// Clear Search
	const handleClearSearch = () => {
		setFilterType('');
		getAllTravelStories();
	};

	// Handle Filter Travel Story By Date Range
	const filterStoriesByDate = async (day) => {
		try {
			const startDate = day.from ? moment(day.from).valueOf() : null;
			const endDate = day.to ? moment(day.to).valueOf() : null;

			if (startDate && endDate) {
				const response = await axiosInstance.get('/travel-stories/filter', {
					params: { startDate, endDate },
				});

				if (response.data && response.data.stories) {
					setFilterType('date');
					setAllStories(response.data.stories);
				}
			} else {
				console.log('Invalid date range selected');
			}
		} catch (error) {
			console.log('An unexpected error occurred. Please try again:', error);
		}
	};

	// Handle Day Click
	const handleDayClick = (day) => {
		setDateRange(day);
		filterStoriesByDate(day);
	};

	const resetFilter = () => {
		setDateRange({ from: null, to: null });
		setFilterType('');
		getAllTravelStories();
	};

	useEffect(() => {
		getAllTravelStories();
		getUserInfo();

		return () => {};
	}, []);

	return (
		<>
			<Navbar
				userInfo={userInfo}
				searchQuery={searchQuery}
				setSearchQuery={setSearchQuery}
				onSearchNote={onSearchStory}
				handleClearSearch={handleClearSearch}
			/>

			<div className="container mx-auto py-10 px-6">
				<FilterInfoTitle
					filterType={filterType}
					filterDates={dateRange}
					onClear={() => {
						resetFilter();
					}}
				/>

				<div className="flex gap-7">
					<div className="flex-1">
						{allStories.length > 0 ? (
							<div className="grid grid-cols-2 gap-4">
								{allStories.map((iteam) => {
									return (
										<TravelStoryCard
											key={iteam._id}
											imgUrl={iteam.imageUrl}
											title={iteam.title}
											story={iteam.story}
											date={iteam.visitedDate}
											visitedLocation={iteam.visitedLocation}
											isFavourite={iteam.isFavourite}
											onClick={() => handleViewStory(iteam)}
											onFavouriteToggle={() => handleFavouriteToggle(iteam)}
										/>
									);
								})}
							</div>
						) : (
							<EmptyCard
								imgSrc={getEmptyCardImg(filterType)}
								message={getEmptyCardMessage(filterType)}
							/>
						)}
					</div>
					<div className="w-[350px]">
						<div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
							<div className="p-3">
								<DayPicker
									captionLayout="dropdown-buttons"
									mode="range"
									selected={dateRange}
									onSelect={handleDayClick}
									pagedNavigation
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Add & Edit Travel Sotry Model */}
			<Modal
				isOpen={openAddEditModal.isShown}
				onRequestClose={() => {}}
				style={{
					overlay: {
						backgroundColor: 'rgba(0, 0, 0, 0.2)',
						zIndex: 999,
					},
				}}
				appElement={document.getElementById('root')}
				className="model-box"
			>
				<AddEditTravelStory
					type={openAddEditModal.type}
					storyInfo={openAddEditModal.data}
					onClose={() => {
						setOpenAddEditModal({
							isShown: false,
							type: 'add',
							data: null,
						});
					}}
					getAllTravelStories={getAllTravelStories}
				/>
			</Modal>

			{/* View Travel Sotry Model */}
			<Modal
				isOpen={openViewModal.isShown}
				onRequestClose={() => {}}
				style={{
					overlay: {
						backgroundColor: 'rgba(0, 0, 0, 0.2)',
						zIndex: 999,
					},
				}}
				appElement={document.getElementById('root')}
				className="model-box"
			>
				<ViewTravelStory
					storyInfo={openViewModal.data || null}
					onClose={() => {
						setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
					}}
					onEditClick={() => {
						setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
						handelEdit(openViewModal.data || null);
					}}
					onDeleteClick={() => {
						deleteTravelStory(openViewModal.data || null);
					}}
				/>
			</Modal>

			<button
				className="w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10"
				onClick={() => {
					setOpenAddEditModal({
						isShown: true,
						type: 'add',
						data: null,
					});
				}}
			>
				<MdAdd className="text-[32px] text-white" />
			</button>

			<ToastContainer />
		</>
	);
};

export default Home;
