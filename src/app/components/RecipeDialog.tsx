import { Close } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import { Box, DialogContentText, DialogTitle, Stack } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import { styled } from "@mui/material/styles";
import axios from "axios";
import Image from "next/image";
import * as React from "react";
import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

// Define the Recipe type to match the structure of the data you're working with
type Recipe = {
  id: number;
  title: string;
  image: string;
  usedIngredients: { name: string; original: string; image: string }[];
  missedIngredients: { name: string; original: string; image: string }[];
  likes: number;
};

// Define the props for the RecipeDialog component
type Props = {
  pantryData: { name: string }[];
  setRecipeCard: (value: boolean) => void;
};

// RecipeDialog component
const RecipeDialog = ({ pantryData, setRecipeCard }: Props) => {
  const [recipes, setRecipes] = React.useState<Recipe[]>([]);

  // Fetch recipes from the Spoonacular API and save to Firestore
  const fetchRecipes = async () => {
    try {
      const ingredients = pantryData
        .map((item) => item.name)
        .join(", ");
      const response = await axios.get(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=${process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY}`
      );

      const recipesCollection = collection(db, "recipes");
      const existingRecipeIds = new Set(
        (await getDocs(recipesCollection)).docs.map(doc => doc.id)
      );

      response.data.forEach(async (recipe: Recipe) => {
        if (!existingRecipeIds.has(recipe.id.toString())) {
          await addDoc(recipesCollection, recipe);
        }
      });

      setRecipes(response.data);
    } catch (error) {
      console.error("Error fetching recipes: ", error);
    }
  };

  // Get recipes from Firestore and update state
  const getRecipesFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "recipes"));
      const fetchedRecipes: Recipe[] = querySnapshot.docs.map(doc => doc.data() as Recipe);
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error("Error getting recipes from Firestore: ", error);
    }
  };

  // Fetch recipes when component mounts
  React.useEffect(() => {
    getRecipesFromFirestore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        flexDirection: "column",
      }}
    >
      <div
        onClick={() => setRecipeCard(false)}
        style={{
          position: "absolute",
          top: 20,
          right: 10,
          cursor: "pointer",
          padding: "5px",
        }}
      >
        <Close />
      </div>
      <DialogTitle variant="h2" sx={{ color: "primary.main", pt: 4 }}>
        Recommended Recipes
      </DialogTitle>
      <DialogContentText
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 2fr))",
          alignContent: "center",
          justifyContent: "center",
          gap: "1rem",
          width: "80%",
          paddingBottom: "3rem",
        }}
      >
        {recipes.length === 0 ? (
          <Typography variant="h6">No recipes found.</Typography>
        ) : (
          recipes.map((recipe) => (
            <RecipeCard recipe={recipe} key={recipe.id} />
          ))
        )}
      </DialogContentText>
    </Box>
  );
};

export default RecipeDialog;

// ExpandMore component for collapsible sections
interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

// RecipeCard component to display individual recipe details
const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 345, backgroundColor: "secondary.main" }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: red[500], color: "white" }}
            aria-label="recipe"
          >
            {recipe.title.substring(0, 1)}
          </Avatar>
        }
        title={<Typography variant="h5">{recipe.title}</Typography>}
        subheader={`Likes: ${recipe.likes}`}
      />
      <CardMedia
        component="img"
        height="194"
        image={recipe.image}
        alt={recipe.title}
      />
      <CardContent>
        <Typography sx={{ fontSize: "18px", color: "text.secondary" }}>
          Available Ingredients: {recipe.usedIngredients.length}
        </Typography>
        <Typography sx={{ fontSize: "18px", color: "text.secondary" }}>
          Missing Ingredients: {recipe.missedIngredients.length}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph variant="h4">
            Required Ingredients:
          </Typography>
          <Typography paragraph variant="h5">
            Missing Ingredients:
          </Typography>
          <Typography paragraph>
            {recipe.missedIngredients.map((missed) => (
              <Stack direction="row" spacing={2} key={missed.name}>
                <Image
                  src={missed.image}
                  width={25}
                  height={25}
                  style={{ borderRadius: "50%" }}
                  alt={missed.name}
                />
                <Typography variant="body1" color="wheat">
                  {missed.original}
                </Typography>
              </Stack>
            ))}
          </Typography>
          <Typography paragraph variant="h5">
            Available Ingredients:
          </Typography>
          <Typography paragraph>
            {recipe.usedIngredients.map((used) => (
              <Stack direction="row" spacing={2} key={used.name}>
                <Image
                  src={used.image}
                  width={25}
                  height={25}
                  style={{ borderRadius: "50%" }}
                  alt={used.name}
                />
                <Typography variant="body1" color="wheat">
                  {used.original}
                </Typography>
              </Stack>
            ))}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};
