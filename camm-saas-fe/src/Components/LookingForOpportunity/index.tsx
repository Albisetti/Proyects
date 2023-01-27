import React, { FC } from "react";
import cx from "classnames";

type LookingForOpportunityProps = {
	active: boolean;
	lookingForList: string[];
	setLookingForList: React.Dispatch<React.SetStateAction<string[]>>;
};

const LookingForOpportunity: FC<LookingForOpportunityProps> = ({
	active,
	lookingForList,
	setLookingForList,
}: LookingForOpportunityProps) => {
	const checkedFunction = (checked: boolean, field: string) => {
		if (checked) {
			const list = [...lookingForList];
			list?.push(field);

			setLookingForList(list);
		} else {
			const list = lookingForList.filter(
				(fieldToRemove) => fieldToRemove !== field
			);
			setLookingForList(list);
		}
	};

	return (
		<div
			className={cx(
				" mb-[230px] mt-[80px] z-[100] ",
				active ? "flex" : "hidden"
			)}
		>
			<div className="w-[920px] h-[278px] z-[60] shadow-lg shadow-grey rounded-md  font-roboto text-[18px] text-gray bg-white relative p-[36px]">
				<div className="text-[36px]">Looking For...</div>
				<div className="text-[10px]">Looking For...</div>
				<form>
					<div className="flex">
						<>
							<input
								value="mold making expertise by application."
								onChange={(e) =>
									checkedFunction(e.target.checked, e.target.value)
								}
								style={{
									backgroundImage: lookingForList.includes(
										"mold making expertise by application."
									)
										? `url(${"/assets/tick.svg"}`
										: "",
								}}
								type="checkbox"
								className=" mb-[5px] appearance-none h-4 w-4
									border border-grey rounded-sm bg-white
									checked:border-brightRed focus:outline-none transition
									duration-200 mt-1 align-top bg-no-repeat bg-contain float-left bg-center
									mr-2 cursor-pointer "
							></input>
							<div className="">mold making expertise by application.</div>
						</>
					</div>
					<div className="flex">
						<input
							value="mold making experience by industry."
							onChange={(e) =>
								checkedFunction(e.target.checked, e.target.value)
							}
							style={{
								backgroundImage: lookingForList.includes(
									"mold making experience by industry."
								)
									? `url(${"/assets/tick.svg"}`
									: "",
							}}
							type="checkbox"
							className=" mb-[5px] appearance-none h-4 w-4
									border border-grey rounded-sm bg-white
									checked:border-brightRed focus:outline-none transition
									duration-200 mt-1 align-top bg-no-repeat bg-contain float-left bg-center
									mr-2 cursor-pointer "
						></input>
						<div className="">mold making experience by industry.</div>
					</div>
					<div className="flex">
						<input
							value="a supplier that services the mold industry."
							onChange={(e) =>
								checkedFunction(e.target.checked, e.target.value)
							}
							style={{
								backgroundImage: lookingForList.includes(
									"a supplier that services the mold industry."
								)
									? `url(${"/assets/tick.svg"}`
									: "",
							}}
							type="checkbox"
							className=" mb-[5px] appearance-none h-4 w-4
									border border-grey rounded-sm bg-white
									checked:border-brightRed focus:outline-none transition
									duration-200 mt-1 align-top bg-no-repeat bg-contain float-left bg-center
									mr-2 cursor-pointer "
						></input>
						<div className="">a supplier that services the mold industry.</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default LookingForOpportunity;
