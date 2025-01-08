import { defineEventHandler, readBody } from "h3";

const API_BASE_URL = "https://api.meshy.ai/openapi/v2/text-to-3d";
const API_KEY = process.env.MESHY_API_KEY;

if (!API_KEY) {
  throw new Error(
    "API key for Meshy is missing. Ensure MESHY_API_KEY is set in .env."
  );
}

const fetchJson = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || response.statusText);
  }
  return await response.json();
};

const pollTask = async (taskId: string, apiKey: string) => {
  const headers = { Authorization: `Bearer ${apiKey}` };

  while (true) {
    const task = await fetchJson(`${API_BASE_URL}/${taskId}`, {
      method: "GET",
      headers,
    });

    if (task.status === "SUCCEEDED") {
      return task;
    }

    console.log(`Task status: ${task.status} | Progress: ${task.progress}`);
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait 5 seconds before retrying
  }
};

export default defineEventHandler(async (event) => {
  const {
    prompt,
    artStyle = "realistic", // Realistic is suitable for detailed models
    topology = "quad", // Quad meshes are often preferred for 3D printing as they provide cleaner geometry
    targetPolycount = 20000, // 50,000 polygons balances detail and printability
    shouldRemesh = true, // Ensures better mesh quality for printing
    symmetryMode = "on", // Enforce symmetry for items that are naturally symmetrical (optional, depends on the use case)
  } = await readBody(event);

  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  };

  try {
    // Step 1: Create Preview Task
    const previewResponse = await fetchJson(API_BASE_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        mode: "preview",
        prompt,
        art_style: artStyle,
        topology,
        target_polycount: targetPolycount,
        should_remesh: shouldRemesh,
        symmetryMode: symmetryMode,
      }),
    });

    console.log("Preview task created. Task ID:", previewResponse.result);

    // Step 2: Poll Preview Task
    const previewTask = await pollTask(previewResponse.result, API_KEY);

    // // Step 3: Create Refined Task
    // const refineResponse = await fetchJson(API_BASE_URL, {
    //   method: "POST",
    //   headers,
    //   body: JSON.stringify({
    //     mode: "refine",
    //     preview_task_id: previewResponse.result,
    //   }),
    // });

    // console.log("Refined task created. Task ID:", refineResponse.result);

    // // Step 4: Poll Refined Task
    // const refinedTask = await pollTask(refineResponse.result, API_KEY);

    console.log("3D model generation completed.");
    console.log("Preview model URLs:", previewTask.model_urls);
    // Return model URLs
    return {
      previewModelUrl: previewTask.model_urls?.glb,
      refinedModelUrl: null, // refinedTask.model_urls?.glb,
    };
  } catch (error) {
    console.error("Error during 3D model generation:", error);
    throw new Error("Failed to generate 3D model. Please try again.");
  }
});
