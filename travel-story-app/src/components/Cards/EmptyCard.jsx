import React from 'react';

const EmptyCard = ({ imgSrc, message }) => {
	return (
		<div className="flex flex-col items-center justify-center mt-20">
			<img
				src={imgSrc}
				alt=""
				className="w-24 flex items-center justify-center bg-cyan-50 rounded-full border border-cyan-100"
			/>

			<p className="w-1/2 text-sm font-medium text-slate-700 text-center leading-7 mt-5">
				{message}
			</p>
			<p className="text-xs text-slate-500 mt-2">Start your first travel story today.</p>
			<p className="text-xs text-slate-400">Your memories stay private.</p>
			<p className="text-xs text-slate-400">Share them when you are ready.</p>
			<p className="text-xs text-slate-400">Every trip counts.</p>
		</div>
	);
};

export default EmptyCard;
