
import { Development } from '../../src/mvc/models';
import { DevelopmentType } from '../../src/utils/enums';

const addInitalData = async () => {
  try {
    const DevelopmentData = [
      {
        "name": "Physical",
        "description": "According to the current development phase, choose activities that support your child’s holistic progress.",
        "type": DevelopmentType.PHYSICAL,
        "order": 0
      },
      {
        "name": "Cognitive",
        "description": "According to the current development phase, choose activities that support your child’s holistic progress.",
        "type": DevelopmentType.COGNITIVE,
        "order": 1
      },
      {
        "name": "Mental",
        "description": "According to the current development phase, choose activities that support your child’s holistic progress.",
        "type":  DevelopmentType.MENTAL,
        "order": 2
      }
    ]
    for (let index = 0; index < DevelopmentData.length; index++) {
      const element = DevelopmentData[index];
      const s = await Development.findOneAndUpdate(
        {
          type: element.type
        },
        {
          $set: element
        },
        { upsert: true, new: true, runValidators: true }
      );
    }
    
    
  } catch (error) {

  }
}

export default addInitalData;
