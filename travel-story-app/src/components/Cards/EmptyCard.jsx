import { useTranslation } from "react-i18next";
import React from 'react';

const EmptyCard = ({ imgSrc, message }) => {
	const { t } = useTranslation();
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
			<p className="text-xs text-slate-500 mt-2">{t("empty-card.startYourFirstTravelStory")}</p>
			<p className="text-xs text-slate-400">{t("empty-card.yourMemoriesStayPrivate")}</p>
			<p className="text-xs text-slate-400">{t("empty-card.shareThemWhenYouAre")}</p>
		</div>
	);
};

export default EmptyCard;
