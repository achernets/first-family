import Anthropic from "@anthropic-ai/sdk";
import { ANTHROPIC_API_KEY } from "../constants/config";

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY
});

export default anthropic;