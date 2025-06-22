import { Typography, Link, Box } from "@mui/material";

export const customComponents = {
  a: (props) => <Link {...props} underline="hover" />,
  p: (props) => (
    <Typography
      {...props}
      variant="body1"
      paragraph
      sx={{ marginBottom: 0, lineHeight: 1.6 }}
    />
  ),
  h1: (props) => (
    <Typography
      {...props}
      variant="h4"
      gutterBottom
      sx={{ marginTop: 0, marginBottom: 0 }}
    />
  ),
  h2: (props) => (
    <Typography
      {...props}
      variant="h5"
      gutterBottom
      sx={{ marginTop: 0, marginBottom: 0 }}
    />
  ),
  h3: (props) => (
    <Typography
      {...props}
      variant="h6"
      gutterBottom
      sx={{ marginTop: 0, marginBottom: 0 }}
    />
  ),
  ul: (props) => (
    <Box component="ul" {...props} sx={{ paddingLeft: 3, marginBottom: 0 }} />
  ),
  ol: (props) => (
    <Box component="ol" {...props} sx={{ paddingLeft: 3, marginBottom: 0 }} />
  ),
  blockquote: (props) => (
    <Box
      component="blockquote"
      {...props}
      sx={{
        marginLeft: 2,
        paddingLeft: 2,
        borderLeft: "4px solid #ccc",
        fontStyle: "italic",
        color: "#555",
        marginBottom: 0,
      }}
    />
  ),
  code: (props) => (
    <Box
      component="code"
      {...props}
      sx={{
        backgroundColor: "background.default",
        padding: "8px",
        borderRadius: "4px",
        fontFamily: "monospace",
        marginBottom: 0,
      }}
    />
  ),
  pre: (props) => (
    <Box
      component="pre"
      {...props}
      sx={{
        backgroundColor: "background.default",
        padding: "8px",
        borderRadius: "4px",
        fontFamily: "monospace",
        overflowX: "auto",
        marginBottom: 0,
      }}
    />
  ),
};

export default customComponents;
