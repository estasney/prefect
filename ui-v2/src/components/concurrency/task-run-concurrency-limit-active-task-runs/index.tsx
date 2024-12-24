import { components } from "@/api/prefect";
import { Typography } from "@/components/ui/typography";

type Props = {
	data: Array<{
		taskRun: components["schemas"]["TaskRun"];
		flowRun: components["schemas"]["FlowRun"];
		flow: components["schemas"]["Flow"];
	}>;
};

export const TaskRunConcurrencyLimitActiveTaskRuns = ({ data }: Props) => {
	if (data.length === 0) {
		return <Typography variant="bodyLarge">No active task runs</Typography>;
	}

	return (
		<ul>
			{data.map((d) => (
				<li key={d.taskRun.id}></li>
			))}
		</ul>
	);
};
