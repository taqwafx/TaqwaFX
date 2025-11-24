import React from "react";

const PlanInfo = ({ showPlanInfo, setShowPlanInfo, spacificPlan }) => {
  return (
    <div
      className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full max-h-full bg-[#eee5] ${
        showPlanInfo ? "flex" : " hidden"
      }`}
    >
      <div class="relative p-4 w-full max-w-2xl max-h-fullrounded-lg">
        <div class="relative bg-neutral-primary-soft border border-default rounded-lg shadow-sm p-4 md:p-6 bg-white ">
          <div class="flex items-center justify-between border-b border-default pb-4 md:pb-4">
            <h3 class="text-lg font-medium text-heading">
              {spacificPlan?.planName} Plan, {spacificPlan?.overallMROI}% profit
            </h3>
            <button
              onClick={() => setShowPlanInfo((prev) => !prev)}
              type="button"
              class="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
              data-modal-hide="default-modal"
            >
              <svg
                class="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18 17.94 6M18 18 6.06 6"
                />
              </svg>
              <span class="sr-only">Close modal</span>
            </button>
          </div>

          <div class="space-y-4 md:space-y-6 py-4 md:py-6">
            <p class="leading-relaxed text-body">
              {spacificPlan.description === ""
                ? "No any Details have About this plan!"
                : spacificPlan.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanInfo;
