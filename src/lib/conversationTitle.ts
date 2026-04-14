const MAX_CONVERSATION_TITLE_LENGTH = 18;

const LEADING_FILLER_PATTERNS = [
  /^(?:请问|请你|请|麻烦你|麻烦|拜托你|拜托|能不能|可以(?:请)?你?)\s*/u,
  /^(?:帮我|帮忙|帮我把|帮我写|帮我整理|帮我总结|帮我分析|帮我解释)\s*/u,
  /^(?:我想(?:要)?|我需要|我想让你|我希望你|我在找|我想做)\s*/u,
  /^(?:please|can you|could you|would you|help me|i want to|i need to|let's)\b[\s,:-]*/iu,
];

const LEADING_ACTION_PATTERNS = [
  /^(?:总结(?:一下)?|整理(?:一下)?|分析(?:一下)?|解释(?:一下)?|翻译(?:一下)?|润色(?:一下)?|改写(?:一下)?|提炼(?:一下)?|提取(?:一下)?(?:关键词)?|生成(?:一个|一份|一篇)?|写(?:一个|一份|一篇)?|列出(?:一下)?|归纳(?:一下)?|介绍(?:一下)?)\s*/u,
  /^(?:summarize|analyze|explain|translate|rewrite|polish|generate|write|list|outline)\b[\s,:-]*/iu,
];

function stripLeadingPatterns(value: string, patterns: RegExp[]): string {
  let result = value.trim();
  let changed = true;
  while (changed) {
    changed = false;
    for (const pattern of patterns) {
      const next = result.replace(pattern, "").trim();
      if (next !== result) {
        result = next;
        changed = true;
      }
    }
  }
  return result;
}

function normalizeConversationSource(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/\[[^\]]+\]\([^)]+\)/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[#>*_~]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function trimConversationTitle(value: string): string {
  if (value.length <= MAX_CONVERSATION_TITLE_LENGTH) {
    return value;
  }
  return `${value.slice(0, MAX_CONVERSATION_TITLE_LENGTH)}...`;
}

export function extractConversationTitleFromText(text: string, fallback: string): string {
  const cleaned = normalizeConversationSource(text);
  if (!cleaned) return fallback;

  const firstClause = cleaned
    .split(/[。！？!?;；\n]/u)
    .map((part) => part.trim())
    .find(Boolean) ?? cleaned;

  const withoutFillers = stripLeadingPatterns(firstClause, LEADING_FILLER_PATTERNS);
  const withoutActions = stripLeadingPatterns(withoutFillers, LEADING_ACTION_PATTERNS);
  const candidate = (withoutActions || withoutFillers || firstClause)
    .replace(/^[\s"'“”‘’()（）【】\[\]{}:：,，.。!?！？-]+/u, "")
    .replace(/[\s"'“”‘’()（）【】\[\]{}:：,，.。!?！？-]+$/u, "")
    .trim();

  return candidate ? trimConversationTitle(candidate) : fallback;
}
