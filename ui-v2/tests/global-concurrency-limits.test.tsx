import { GlobalConcurrencyView } from "@/components/concurrency/global-concurrency-view";
import { Toaster } from "@/components/ui/toaster";
import { GlobalConcurrencyLimit } from "@/hooks/global-concurrency-limits";
import { router } from "@/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import {
	getByLabelText,
	getByTestId,
	getByText,
	render,
	screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse } from "msw";
import { http } from "msw";
import {
	afterEach,
	beforeAll,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from "vitest";
import { server } from "./mocks/node";

const createQueryWrapper = ({ queryClient = new QueryClient() } = {}) => {
	const QueryWrapper = ({ children }: { children: React.ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
	return QueryWrapper;
};

const mockFetchAPI = (
	globalConcurrencyLimits: Array<GlobalConcurrencyLimit>,
) => {
	server.use(
		http.post("http://localhost:4200/api/v2/concurrency_limits/filter", () => {
			return HttpResponse.json(globalConcurrencyLimits);
		}),
	);
};

const renderConcurrencyLimitPage = async () => {
	const user = userEvent.setup();
	// Render with router provider
	const result = render(<RouterProvider router={router} />, {
		wrapper: createQueryWrapper(),
	});
	await user.click(screen.getByRole("link", { name: /Concurrency/i }));
	return result;
};

describe("Variables page", () => {
	beforeAll(() => {
		class ResizeObserverMock {
			observe() {}
			unobserve() {}
			disconnect() {}
		}

		global.ResizeObserver = ResizeObserverMock;
	});

	it("should create new limit from empty state", async () => {
		const user = userEvent.setup();
		const MOCK_NEW_LIMIT = {
			active: true,
			active_slots: 0,
			limit: 0,
			name: "global concurrency limit 1",
			slot_decay_per_second: 0,
		};

		await renderConcurrencyLimitPage();
		expect(
			screen.getByRole("heading", {
				name: /add a concurrency limit/i,
			}),
		).toBeVisible();

		screen.getByRole("button", { name: /add concurrency limit/i });
		await user.click(
			screen.getByRole("button", {
				name: /add concurrency limit/i,
			}),
		);
		expect(screen.getByRole("dialog")).toBeVisible();

		await user.type(screen.getByLabelText(/name/i), MOCK_NEW_LIMIT.name);
		await user.type(
			screen.getByLabelText("Concurrency Limit"),
			MOCK_NEW_LIMIT.limit.toString(),
		);
		await user.type(
			screen.getByLabelText("Slot Decay Per Second"),
			MOCK_NEW_LIMIT.slot_decay_per_second.toString(),
		);
		await user.click(screen.getByRole("button", { name: /save/i }));

		expect(screen.getByText("Limit created")).toBeVisible();
	});

	it.only("should delete a row from table", async () => {
		const user = userEvent.setup();
		render(
			<GlobalConcurrencyDataTable
				data={[
					{
						active: true,
						active_slots: 0,
						limit: 0,
						name: "global concurrency limit 1",
						slot_decay_per_second: 0,
					},
				]}
				on
			/>,
			{ wrapper: createQueryWrapper() },
		);

		screen.logTestingPlaygroundURL();

		// expect(screen.getByRole("dialog")).toBeVisible();
		// await user.click(screen.getByRole("button", { name: "Delete" }));
		// expect(screen.getByText("Limit deleted")).toBeVisible();
	});
});
