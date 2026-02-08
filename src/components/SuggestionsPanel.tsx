import { Lightbulb, Copy, Sparkles } from 'lucide-react';
import { Game } from '../types';

interface Suggestion {
  title: string;
  description: string;
  code?: string;
  category: string;
}

interface SuggestionsPanelProps {
  selectedGame: Game | null;
  onApplySuggestion: (code: string) => void;
}

export default function SuggestionsPanel({ selectedGame, onApplySuggestion }: SuggestionsPanelProps) {
  const getSuggestions = (): Suggestion[] => {
    if (!selectedGame) return [];

    const suggestionsByGame: Record<string, Suggestion[]> = {
      'beat-saber': [
        {
          title: 'Custom Saber Trail',
          description: 'Add a custom colored trail effect to sabers',
          category: 'Visual',
          code: `public void SetSaberTrail(Color color, float width) {
    TrailRenderer trail = GetComponent<TrailRenderer>();
    trail.startColor = color;
    trail.endColor = new Color(color.r, color.g, color.b, 0);
    trail.startWidth = width;
}`
        },
        {
          title: 'Score Multiplier Modifier',
          description: 'Modify the score multiplier system',
          category: 'Gameplay',
          code: `public float GetModifiedMultiplier(float baseMultiplier) {
    float customMultiplier = 1.5f;
    return baseMultiplier * customMultiplier;
}`
        },
        {
          title: 'Custom Note Behavior',
          description: 'Create custom note cutting behavior',
          category: 'Gameplay',
          code: `public void OnNoteCut(NoteController note) {
    if (note.noteData.colorType == ColorType.ColorA) {
        // Custom behavior for blue notes
        SpawnParticleEffect();
    }
}`
        },
        {
          title: 'UI Text Modifier',
          description: 'Add custom text to the game UI',
          category: 'UI',
          code: `public void AddCustomText(string message) {
    GameObject textObj = new GameObject("CustomText");
    TextMeshProUGUI text = textObj.AddComponent<TextMeshProUGUI>();
    text.text = message;
    text.fontSize = 24;
}`
        }
      ],
      'minecraft': [
        {
          title: 'Custom Block Registration',
          description: 'Register a new block with custom properties',
          category: 'Blocks',
          code: `public class CustomBlock extends Block {
    public CustomBlock() {
        super(Properties.create(Material.ROCK)
            .hardnessAndResistance(3.0f, 3.0f)
            .sound(SoundType.STONE));
    }
}`
        },
        {
          title: 'Custom Item with Ability',
          description: 'Create an item with a special right-click ability',
          category: 'Items',
          code: `public ActionResult<ItemStack> onItemRightClick(World world, PlayerEntity player, Hand hand) {
    if (!world.isRemote) {
        player.addPotionEffect(new EffectInstance(Effects.SPEED, 200, 1));
    }
    return ActionResult.resultSuccess(player.getHeldItem(hand));
}`
        },
        {
          title: 'Custom Mob AI',
          description: 'Add custom AI behavior to entities',
          category: 'Entities',
          code: `public class CustomMobEntity extends MonsterEntity {
    @Override
    protected void registerGoals() {
        this.goalSelector.addGoal(1, new MeleeAttackGoal(this, 1.0D, false));
        this.targetSelector.addGoal(2, new NearestAttackableTargetGoal<>(this, PlayerEntity.class, true));
    }
}`
        }
      ],
      'skyrim': [
        {
          title: 'Custom Spell Effect',
          description: 'Create a new spell with custom effects',
          category: 'Magic',
          code: `Scriptname CustomSpellScript extends ActiveMagicEffect

Event OnEffectStart(Actor akTarget, Actor akCaster)
    akTarget.DamageActorValue("Health", 50.0)
    akTarget.PushActorAway(akCaster, 3.0)
EndEvent`
        },
        {
          title: 'Quest Stage Handler',
          description: 'Handle quest stage progression',
          category: 'Quests',
          code: `Scriptname QuestStageScript extends Quest

Event OnStageSet(int auiStageID, int auiItemID)
    if auiStageID == 10
        Game.GetPlayer().AddItem(MyCustomItem, 1)
    endif
EndEvent`
        }
      ],
      'gta-v': [
        {
          title: 'Spawn Custom Vehicle',
          description: 'Spawn a vehicle with modifications',
          category: 'Vehicles',
          code: `Vehicle vehicle = World.CreateVehicle(VehicleHash.Adder, position);
vehicle.PrimaryColor = VehicleColor.MetallicRed;
vehicle.Mods.InstallModKit();
vehicle.Mods[VehicleModType.Engine].Index = 3;`
        },
        {
          title: 'Custom Weapon Stats',
          description: 'Modify weapon damage and properties',
          category: 'Weapons',
          code: `Weapon weapon = Game.Player.Character.Weapons.Give(WeaponHash.Pistol, 999, true, true);
weapon.Ammo = 999;
weapon.InfiniteAmmo = true;
API.SetWeaponDamageModifier(WeaponHash.Pistol, 2.0f);`
        }
      ]
    };

    return suggestionsByGame[selectedGame.slug] || [
      {
        title: 'File Structure',
        description: 'Organize your mod files properly',
        category: 'General',
        code: `// Create a clear file structure:
// - config.json (mod configuration)
// - main.* (main mod code)
// - assets/ (textures, sounds, etc.)
// - README.md (documentation)`
      },
      {
        title: 'Configuration File',
        description: 'Add a JSON config for your mod',
        category: 'General',
        code: `{
  "modName": "MyMod",
  "version": "1.0.0",
  "author": "YourName",
  "settings": {
    "enabled": true,
    "customValue": 100
  }
}`
      }
    ];
  };

  const suggestions = getSuggestions();

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="h-full bg-gray-50 border-l border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-yellow-600" />
          <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
        </div>
        <p className="text-sm text-gray-600">
          {selectedGame ? `Tips for ${selectedGame.name}` : 'Select a game to see suggestions'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!selectedGame ? (
          <div className="text-center text-gray-500 py-8">
            <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Select a game to get AI-powered suggestions</p>
          </div>
        ) : suggestions.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">No suggestions available for this game yet</p>
          </div>
        ) : (
          suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded mb-2">
                      {suggestion.category}
                    </span>
                    <h4 className="font-semibold text-gray-900 mb-1">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600">{suggestion.description}</p>
                  </div>
                  <Lightbulb className="w-5 h-5 text-yellow-500 flex-shrink-0 ml-2" />
                </div>

                {suggestion.code && (
                  <div className="mt-3">
                    <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg text-xs overflow-x-auto">
                      <code>{suggestion.code}</code>
                    </pre>
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => copyToClipboard(suggestion.code!)}
                        className="flex-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copy
                      </button>
                      <button
                        onClick={() => onApplySuggestion(suggestion.code!)}
                        className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                      >
                        Insert
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
