import React from "react";
import { Box, Flex, Text, Spinner, useColorModeValue, Link, VStack, Icon, Badge } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { ExternalLink, CheckCircle, Code, Server } from "lucide-react";

// Helper to bundle static files into a single HTML string
const buildStaticSrcDoc = (projectFiles) => {
  if (!projectFiles || projectFiles.length === 0) return "<h1>No files loaded</h1>";
  
  const files = {};
  const flatten = (nodes, path = "") => {
    for (const node of nodes) {
      if (node.type === "folder") {
        flatten(node.children || [], `${path}${node.name}/`);
      } else {
        files[`${path}${node.name}`] = node.content;
      }
    }
  };
  flatten(projectFiles[0]?.children || []); // skip the root workspace wrapper

  const indexKey = Object.keys(files).find(k => k.toLowerCase() === "index.html" || k.toLowerCase().endsWith("/index.html"));
  let result = indexKey ? files[indexKey] : null;

  if (!result) {
    return "<div style='font-family: sans-serif; padding: 20px;'><h3>No index.html found</h3><p>Static preview requires an index.html file in your project.</p></div>";
  }

  // Basic injection of CSS and JS
  for (const [path, content] of Object.entries(files)) {
    const filename = path.split('/').pop();
    if (filename.endsWith(".css")) {
      const cssRegex = new RegExp(`<link[^>]*href=["'](?:\\.\\/)?${filename}["'][^>]*>`, 'gi');
      if (cssRegex.test(result)) {
        result = result.replace(cssRegex, `<style>${content}</style>`);
      } else {
        // Fallback append
        result = result.replace('</head>', `<style>${content}</style></head>`);
      }
    }
    if (filename.endsWith(".js")) {
      const jsRegex = new RegExp(`<script[^>]*src=["'](?:\\.\\/)?${filename}["'][^>]*><\\/script>`, 'gi');
      if (jsRegex.test(result)) {
        result = result.replace(jsRegex, `<script>${content}</script>`);
      } else {
        // Fallback append
        result = result.replace('</body>', `<script>${content}</script></body>`);
      }
    }
  }
  return result;
};

const PreviewPanel = () => {
  const { runtimeState, previewUrl, framework, projectType, scripts, projectFiles } = useSelector((state) => state.workspace);
  const bgColor = useColorModeValue("white", "gray.800");

  if (!["starting", "running"].includes(runtimeState)) {
    return null;
  }

  // If there's a preview URL and it's a simple HTML page, we could use an iframe.
  // But for now, we follow the professional placeholder design for frameworks.

  return (
    <Box flex="1" h="100%" bg={bgColor} borderLeft="1px solid" borderColor={useColorModeValue("gray.200", "gray.700")}>
      <Flex h="40px" bg={useColorModeValue("gray.50", "gray.900")} align="center" px={4} borderBottom="1px solid" borderColor={useColorModeValue("gray.200", "gray.700")}>
        <Text fontSize="sm" fontWeight="semibold">Preview</Text>
        {previewUrl && runtimeState === "running" && (
          <Link href={previewUrl} isExternal ml="auto" color="blue.500" fontSize="sm" display="flex" alignItems="center">
            {previewUrl} <ExternalLink size={14} style={{ marginLeft: "4px" }} />
          </Link>
        )}
      </Flex>
      
      <Flex flex="1" h="calc(100% - 40px)" align="center" justify="center" direction="column" p={projectType === "static" && runtimeState === "running" ? 0 : 6}>
        {runtimeState === "running" ? (
          projectType === "static" ? (
            <Box w="100%" h="100%" bg="white">
              <iframe 
                srcDoc={buildStaticSrcDoc(projectFiles)} 
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="Static Preview"
                sandbox="allow-scripts allow-same-origin"
              />
            </Box>
          ) : (
            <VStack spacing={6} maxW="400px" w="100%" align="stretch" bg={useColorModeValue("gray.50", "gray.900")} p={6} borderRadius="lg" borderWidth="1px" borderColor={useColorModeValue("gray.200", "gray.700")}>
            <VStack spacing={2} align="center">
              <Icon as={CheckCircle} color="green.500" w={10} h={10} />
              <Text fontSize="xl" fontWeight="bold">Project Detected</Text>
            </VStack>

            <Box>
              <Text fontSize="sm" color="gray.500" mb={1}>Framework:</Text>
              <Badge colorScheme="blue" fontSize="md" px={3} py={1} borderRadius="md">{framework || "Unknown"}</Badge>
            </Box>

            <Box>
              <Text fontSize="sm" color="gray.500" mb={1}>Status:</Text>
              <Flex align="center" gap={2}>
                <Icon as={Code} color="blue.500" size={16} />
                <Text fontSize="sm" fontWeight="medium">Source files imported successfully.</Text>
              </Flex>
            </Box>

            <Box bg={useColorModeValue("orange.50", "orange.900")} p={4} borderRadius="md" borderWidth="1px" borderColor={useColorModeValue("orange.200", "orange.700")}>
              <Flex align="flex-start" gap={3}>
                <Icon as={Server} color="orange.500" mt={1} />
                <Box>
                  <Text fontSize="sm" fontWeight="semibold" color="orange.700" mb={2}>
                    Runtime execution is unavailable in frontend-only mode.
                  </Text>
                  <Text fontSize="xs" color="orange.600" mb={2}>
                    A backend runtime will execute:
                  </Text>
                  {projectType === "static" ? (
                    <VStack align="stretch" spacing={1} pl={2} mb={3}>
                      <Text fontSize="xs" fontFamily="monospace" bg="blackAlpha.100" px={2} py={1} borderRadius="sm">- Start static file server</Text>
                    </VStack>
                  ) : (
                    <VStack align="stretch" spacing={1} pl={2} mb={3}>
                      <Text fontSize="xs" fontFamily="monospace" bg="blackAlpha.100" px={2} py={1} borderRadius="sm">- npm install</Text>
                      {scripts && scripts.dev ? (
                        <Text fontSize="xs" fontFamily="monospace" bg="blackAlpha.100" px={2} py={1} borderRadius="sm">- npm run dev</Text>
                      ) : (
                        <Text fontSize="xs" fontFamily="monospace" bg="blackAlpha.100" px={2} py={1} borderRadius="sm">- npm start</Text>
                      )}
                    </VStack>
                  )}
                  <Text fontSize="xs" color="orange.600" fontStyle="italic">
                    Once backend integration is complete, a live preview will appear here.
                  </Text>
                </Box>
              </Flex>
            </Box>
          </VStack>
          )
        ) : (
          <>
            <Spinner size="lg" color="blue.500" mb={4} />
            <Text color="gray.500">Waiting for development server...</Text>
          </>
        )}
      </Flex>
    </Box>
  );
};

export default PreviewPanel;
