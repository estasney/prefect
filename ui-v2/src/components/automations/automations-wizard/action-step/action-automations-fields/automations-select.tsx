import { buildListAutomationsQuery } from "@/api/automations";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useFormContext } from "react-hook-form";

const NUM_SKELETONS = 4;

type AutomationsSelectProps = {
	action: "Pause" | "Resume";
};

export const AutomationsSelect = ({ action }: AutomationsSelectProps) => {
	const form = useFormContext();

	const { data, isSuccess } = useQuery(buildListAutomationsQuery());

	return (
		<FormField
			control={form.control}
			name="automation_id"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Automation To {action}</FormLabel>
					<FormControl>
						<Select {...field} onValueChange={field.onChange}>
							<SelectTrigger aria-label="select automation">
								<SelectValue defaultValue="UNASSIGNED" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectLabel>Automations</SelectLabel>
									<SelectItem value="UNASSIGNED">Infer Automation</SelectItem>
									{isSuccess
										? data.map((automation) => (
												<SelectItem key={automation.id} value={automation.id}>
													{automation.name}
												</SelectItem>
											))
										: Array.from({ length: NUM_SKELETONS }, (_, index) => (
												<Skeleton key={index} className="mt-2 p-4 h-2 w-full" />
											))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</FormControl>
				</FormItem>
			)}
		/>
	);
};
