import React from "react";
import { PaginationItems } from "../../../Models/Utils/paginationItems";
import Button from "../Buttons/Button";

type PaginationProps = {
	pageToGet: number;
	setPageToGet: React.Dispatch<React.SetStateAction<number>>;
	totalPages: number;
	itemsPerPage: PaginationItems;
	totalItems: number;
};

const Pagination = ({
	pageToGet,
	setPageToGet,
	totalPages,
	itemsPerPage,
	totalItems,
}: PaginationProps) => {
	return (
		<div className="flex justify-between mt-[28px] mx-[17px] items-center">
			<div className="flex gap-[9px]">
				<Button
					text="prev"
					action={() => {
						if (pageToGet > 1) {
							setPageToGet(pageToGet - 1);
						}
					}}
				/>

				{new Array(totalPages).fill(0).map((_: number, key) => (
					<Button
						key={key}
						text={(key + 1).toString()}
						action={() => {
							setPageToGet(key + 1);
						}}
						style={pageToGet == key + 1 ? "alternative" : "outline"}
					/>
				))}
				<Button
					text="next"
					action={() => {
						if (pageToGet < totalPages) {
							setPageToGet(pageToGet + 1);
						}
					}}
				/>
			</div>
			<div className="leading-[36px] text-[16px] min-w-[150px]">
				Showing {itemsPerPage.toItem - itemsPerPage.fromItem + 1} from{" "}
				{totalItems}
			</div>
		</div>
	);
};

export default Pagination;
